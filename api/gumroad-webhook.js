import crypto from 'crypto';

const GUMROAD_WEBHOOK_SECRET = process.env.GUMROAD_WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_URL = 'https://api.clerk.com/v1';

function verifyGumroadSignature(rawBody, signature) {
  if (!GUMROAD_WEBHOOK_SECRET || !signature) return false;
  const expected = crypto
    .createHmac('sha256', GUMROAD_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

async function clerkRequest(endpoint, options = {}) {
  const url = `${CLERK_API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Clerk API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function findUserByEmail(email) {
  const data = await clerkRequest(
    `/users?email_address=${encodeURIComponent(email)}&limit=1`
  );
  return data?.data?.[0] || null;
}

function getSubscriptionInfo(price) {
  const priceMap = {
    990: { plan: 'monthly', days: 31, label: 'Monthly Plan' },
    2500: { plan: 'quarterly', days: 92, label: 'Quarterly Plan' },
    8900: { plan: 'yearly', days: 366, label: 'Yearly Plan' },
  };

  return priceMap[price] || null;
}

function calculateExpiry(daysFromNow) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysFromNow);
  return expiryDate.toISOString();
}

async function activateSubscription(userId, subscriptionInfo, gumroadData) {
  const expiry = calculateExpiry(subscriptionInfo.days);

  return clerkRequest(`/users/${userId}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify({
      publicMetadata: {
        isPro: true,
        subscriptionPlan: subscriptionInfo.plan,
        subscriptionLabel: subscriptionInfo.label,
        subscriptionExpiry: expiry,
        subscriptionDays: subscriptionInfo.days,
        proSource: 'gumroad',
        proUpdatedAt: new Date().toISOString(),
        gumroadProductId: gumroadData.product_id || '',
        gumroadPurchaseId: gumroadData.id || '',
        gumroadEmail: gumroadData.email || '',
        subscriptionActive: true,
      },
      privateMetadata: {
        gumroadPurchaseData: gumroadData,
      },
    }),
  });
}

async function deactivateSubscription(userId, gumroadData = {}) {
  return clerkRequest(`/users/${userId}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify({
      publicMetadata: {
        isPro: false,
        subscriptionPlan: null,
        subscriptionLabel: null,
        subscriptionExpiry: null,
        subscriptionDays: null,
        subscriptionActive: false,
        proRevokedAt: new Date().toISOString(),
        proRevokeReason: gumroadData.event || 'manual',
      },
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-gumroad-signature'] || '';
  const rawBody =
    typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body);

  if (!verifyGumroadSignature(rawBody, signature)) {
    console.error('Gumroad webhook signature verification failed');
    return res.status(403).json({ error: 'Invalid signature' });
  }

  let payload;
  try {
    payload =
      typeof req.body === 'object' && req.body !== null
        ? req.body
        : JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const email = payload.email || '';
  const price = parseInt(payload.price, 10) || 0;
  const eventType = payload.event || '';
  const isSubscription = payload.is_subscription || false;

  if (!email) {
    console.error('Gumroad webhook missing email');
    return res.status(400).json({ error: 'Missing email in payload' });
  }

  console.log(`Gumroad webhook received:`);
  console.log(`  - Event: ${eventType}`);
  console.log(`  - Email: ${email}`);
  console.log(`  - Price: ${price} cents ($${(price / 100).toFixed(2)})`);
  console.log(`  - Is Subscription: ${isSubscription}`);
  console.log(`  - Full payload:`, JSON.stringify(payload, null, 2));

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      console.warn(`No Clerk user found for email: ${email}`);
      return res.status(200).json({
        received: true,
        warning: 'No matching Clerk user found',
        email,
      });
    }

    const isPurchase =
      eventType === 'sale' ||
      eventType === 'subscription_created' ||
      eventType === 'subscription_restarted' ||
      (isSubscription && eventType !== 'subscription_cancelled');

    const isRevoke =
      eventType === 'refund' ||
      eventType === 'subscription_cancelled' ||
      eventType === 'subscription_expired' ||
      eventType === 'dispute';

    if (isPurchase) {
      const subscriptionInfo = getSubscriptionInfo(price);

      if (!subscriptionInfo) {
        console.error(`Unknown price: ${price} cents. Cannot determine subscription plan.`);
        return res.status(400).json({
          error: 'Unknown price tier',
          price,
          supportedPrices: [990, 2500, 8900],
        });
      }

      await activateSubscription(user.id, subscriptionInfo, payload);
      console.log(`Subscription activated: ${subscriptionInfo.label} for user ${user.id} (${email})`);
      console.log(`  - Expires: ${calculateExpiry(subscriptionInfo.days)}`);

      return res.status(200).json({
        received: true,
        userId: user.id,
        subscriptionPlan: subscriptionInfo.plan,
        subscriptionExpiry: calculateExpiry(subscriptionInfo.days),
        days: subscriptionInfo.days,
      });

    } else if (isRevoke) {
      await deactivateSubscription(user.id, payload);
      console.log(`Subscription deactivated for user ${user.id} (${email}), reason: ${eventType}`);

      return res.status(200).json({
        received: true,
        userId: user.id,
        subscriptionActive: false,
        revokedReason: eventType,
      });

    } else {
      console.log(`Unhandled event type: ${eventType}`);
      return res.status(200).json({
        received: true,
        handled: false,
        eventType,
      });
    }

  } catch (error) {
    console.error('Error processing Gumroad webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
