import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// 创建订阅 Checkout 会话
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { planId, priceId, successUrl, cancelUrl } = req.body;

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // 可选：添加客户信息
      // customer_email: userEmail,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Webhook 处理订阅事件
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // 处理订阅事件
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Subscription created:', session);
        // TODO: 更新用户的订阅状态到数据库
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription);
        // TODO: 更新用户的订阅状态
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('Subscription cancelled:', deletedSubscription);
        // TODO: 取消用户的订阅状态
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// 获取订阅状态
app.get('/api/subscription-status', async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      res.json({
        active: true,
        subscription: subscriptions.data[0],
      });
    } else {
      res.json({ active: false });
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
