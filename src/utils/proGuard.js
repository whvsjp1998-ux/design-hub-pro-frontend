const GUMROAD_PRODUCT_URL = 'https://whimsical2103.gumroad.com/l/designhubpro';

const QUOTA_CONFIG = {
  free: { limit: 10, period: 'daily', label: 'Free Plan' },
  monthly: { limit: 500, period: 'monthly', label: 'Monthly Plan' },
  quarterly: { limit: 2000, period: 'monthly', label: 'Quarterly Plan' },
  unlimited: { limit: Infinity, period: 'monthly', label: 'Yearly Plan' }
};

const STORAGE_KEYS = {
  freeUsage: 'quota_usage_free',
  monthlyUsage: 'quota_usage_monthly',
  trialExpiry: 'quota_trial_expiry',
  trialStarted: 'quota_trial_started'
};

function getCurrentPeriod() {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return { today, month, now };
}

function getTrialStatus() {
  const trialExpiry = localStorage.getItem(STORAGE_KEYS.trialExpiry);
  const trialStarted = localStorage.getItem(STORAGE_KEYS.trialStarted);

  if (!trialStarted) {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + 7);
    localStorage.setItem(STORAGE_KEYS.trialStarted, now.toISOString());
    localStorage.setItem(STORAGE_KEYS.trialExpiry, expiry.toISOString());
    return { isTrial: true, daysLeft: 7, expiry };
  }

  if (trialExpiry) {
    const expiry = new Date(trialExpiry);
    const now = new Date();
    if (now < expiry) {
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return { isTrial: true, daysLeft, expiry };
    }
  }

  return { isTrial: false, daysLeft: 0, expiry: null };
}

function isSubscriptionExpired(expiryDate) {
  if (!expiryDate) return true;
  const expiry = new Date(expiryDate);
  const now = new Date();
  return now > expiry;
}

function getDaysUntilExpiry(expiryDate) {
  if (!expiryDate) return 0;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getSubscriptionPlan(clerk) {
  if (!clerk?.user) return 'free';

  const metadata = clerk.user.publicMetadata || {};

  if (metadata.subscriptionActive && metadata.subscriptionPlan) {
    if (metadata.subscriptionExpiry && isSubscriptionExpired(metadata.subscriptionExpiry)) {
      return 'free';
    }
    return metadata.subscriptionPlan;
  }

  return 'free';
}

export function getSubscriptionExpiry(clerk) {
  if (!clerk?.user) return null;
  const metadata = clerk.user.publicMetadata || {};
  return metadata.subscriptionExpiry || null;
}

export function getDaysRemaining(clerk) {
  const expiry = getSubscriptionExpiry(clerk);
  if (!expiry) return 0;
  return getDaysUntilExpiry(expiry);
}

export function getRemainingQuota(clerk) {
  const plan = getSubscriptionPlan(clerk);
  const config = QUOTA_CONFIG[plan];

  if (config.limit === Infinity) return Infinity;

  const { today, month } = getCurrentPeriod();
  const storageKey = plan === 'free' ? STORAGE_KEYS.freeUsage : STORAGE_KEYS.monthlyUsage;

  let usageData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const periodKey = plan === 'free' ? today : month;

  if (usageData.period !== periodKey) {
    usageData = { period: periodKey, count: 0 };
    localStorage.setItem(storageKey, JSON.stringify(usageData));
  }

  const remaining = config.limit - usageData.count;
  return Math.max(0, remaining);
}

export function getQuotaResetTime(clerk) {
  const plan = getSubscriptionPlan(clerk);
  const { now } = getCurrentPeriod();

  if (plan === 'free') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const expiry = getSubscriptionExpiry(clerk);
  if (expiry) {
    const expiryDate = new Date(expiry);
    return expiryDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return nextMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function consumeQuota(clerk, count = 1) {
  const plan = getSubscriptionPlan(clerk);
  const config = QUOTA_CONFIG[plan];

  if (config.limit === Infinity) return true;

  const { today, month } = getCurrentPeriod();
  const storageKey = plan === 'free' ? STORAGE_KEYS.freeUsage : STORAGE_KEYS.monthlyUsage;

  let usageData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const periodKey = plan === 'free' ? today : month;

  if (usageData.period !== periodKey) {
    usageData = { period: periodKey, count: 0 };
  }

  if (usageData.count + count > config.limit) {
    return false;
  }

  usageData.count += count;
  localStorage.setItem(storageKey, JSON.stringify(usageData));
  return true;
}

export function isProUser(clerk) {
  if (!clerk || !clerk.user) return false;
  const metadata = clerk.user.publicMetadata || {};

  if (!metadata.isPro) return false;

  if (metadata.subscriptionActive && metadata.subscriptionExpiry) {
    return !isSubscriptionExpired(metadata.subscriptionExpiry);
  }

  if (metadata.isPro && !metadata.subscriptionActive) {
    return true;
  }

  return false;
}

export function hasQuota(clerk) {
  const remaining = getRemainingQuota(clerk);
  return remaining > 0 || remaining === Infinity;
}

export function getQuotaInfo(clerk) {
  const plan = getSubscriptionPlan(clerk);
  const remaining = getRemainingQuota(clerk);
  const config = QUOTA_CONFIG[plan];
  const trial = getTrialStatus();
  const resetTime = getQuotaResetTime(clerk);
  const expiry = getSubscriptionExpiry(clerk);
  const daysRemaining = getDaysRemaining(clerk);

  return {
    plan,
    planLabel: config.label,
    limit: config.limit,
    remaining,
    resetTime,
    isTrial: trial.isTrial,
    trialDaysLeft: trial.daysLeft,
    expiry,
    daysRemaining
  };
}

export function requirePro(clerk) {
  if (isProUser(clerk)) return true;

  const overlay = document.createElement('div');
  overlay.id = 'pro-gate-overlay';
  overlay.style.cssText =
    'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);';

  overlay.innerHTML = `
    <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:1.5rem;padding:3rem;max-width:440px;width:90%;text-align:center;">
      <div style="font-size:3rem;margin-bottom:1rem;">🔒</div>
      <h2 style="color:var(--text-primary);margin:0 0 0.75rem;font-size:1.5rem;">Upgrade Required</h2>
      <p style="color:var(--text-secondary);margin:0 0 2rem;line-height:1.6;">
        This feature requires a Pro subscription.<br>
        Upgrade now to unlock more AI recognition quota.
      </p>
      <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener"
         style="display:inline-block;padding:0.875rem 2rem;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 100%);color:#fff;border:none;border-radius:0.75rem;font-size:1rem;font-weight:600;text-decoration:none;cursor:pointer;margin-bottom:1rem;">
        View Plans
      </a>
      <br>
      <button id="pro-gate-close"
              style="margin-top:0.5rem;padding:0.5rem 1rem;background:transparent;border:1px solid var(--border-color);border-radius:0.5rem;color:var(--text-secondary);cursor:pointer;font-size:0.875rem;">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#pro-gate-close').addEventListener('click', () => {
    overlay.remove();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  return false;
}

export function requireQuota(clerk) {
  if (!hasQuota(clerk)) {
    const overlay = document.createElement('div');
    overlay.id = 'quota-gate-overlay';
    overlay.style.cssText =
      'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);';

    const plan = getSubscriptionPlan(clerk);
    const resetTime = getQuotaResetTime(clerk);

    let message = `您今天的免费额度已用完。配额将于 ${resetTime} 重置。`;

    overlay.innerHTML = `
      <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:1.5rem;padding:3rem;max-width:440px;width:90%;text-align:center;">
        <div style="font-size:3rem;margin-bottom:1rem;">📊</div>
        <h2 style="color:var(--text-primary);margin:0 0 0.75rem;font-size:1.5rem;">Quota Exceeded</h2>
        <p style="color:var(--text-secondary);margin:0 0 2rem;line-height:1.6;">
          ${message}
        </p>
        <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener"
           style="display:inline-block;padding:0.875rem 2rem;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 100%);color:#fff;border:none;border-radius:0.75rem;font-size:1rem;font-weight:600;text-decoration:none;cursor:pointer;margin-bottom:1rem;">
          Upgrade Plan
        </a>
        <br>
        <button id="quota-gate-close"
                style="margin-top:0.5rem;padding:0.5rem 1rem;background:transparent;border:1px solid var(--border-color);border-radius:0.5rem;color:var(--text-secondary);cursor:pointer;font-size:0.875rem;">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#quota-gate-close').addEventListener('click', () => {
      overlay.remove();
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    return false;
  }
  return true;
}
