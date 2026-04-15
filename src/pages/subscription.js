import { t } from '../utils/i18n.js';

// Subscription 页面组件
export function createSubscription() {
  return `
    <section class="subscription-page">
      <div class="subscription-header">
        <h1 class="page-title">${t('subscription.title') || '订阅计划'}</h1>
        <p class="page-subtitle">${t('subscription.subtitle') || '选择适合您的计划'}</p>
      </div>

      <div class="pricing-cards">
        <!-- 免费计划 -->
        <div class="pricing-card">
          <div class="plan-badge free">免费</div>
          <h3 class="plan-name">Free</h3>
          <div class="plan-price">
            <span class="price">$0</span>
            <span class="period">/月</span>
          </div>
          <ul class="plan-features">
            <li>✓ 每月 10 次图像识别</li>
            <li>✓ 基础识别模式</li>
            <li>✓ 标准处理速度</li>
            <li>✗ 批量处理</li>
            <li>✗ 自定义提示词</li>
            <li>✗ 优先支持</li>
          </ul>
          <button class="plan-button current" disabled>当前计划</button>
        </div>

        <!-- 付费计划 -->
        <div class="pricing-card featured">
          <div class="plan-badge pro">推荐</div>
          <h3 class="plan-name">Pro</h3>
          <div class="plan-price">
            <span class="price">$9.99</span>
            <span class="period">/月</span>
          </div>
          <ul class="plan-features">
            <li>✓ 无限次图像识别</li>
            <li>✓ 所有识别模式</li>
            <li>✓ 高速处理</li>
            <li>✓ 批量处理</li>
            <li>✓ 自定义提示词</li>
            <li>✓ 优先支持</li>
          </ul>
          <button id="upgradeToPro" class="plan-button primary">升级到 Pro</button>
        </div>
      </div>

      <div class="subscription-info">
        <h3>常见问题</h3>
        <div class="faq-item">
          <h4>如何取消订阅？</h4>
          <p>您可以随时在账户设置中取消订阅，取消后将在当前计费周期结束时生效。</p>
        </div>
        <div class="faq-item">
          <h4>支持哪些支付方式？</h4>
          <p>我们支持信用卡、借记卡以及 Apple Pay 等主流支付方式。</p>
        </div>
        <div class="faq-item">
          <h4>可以随时升级或降级吗？</h4>
          <p>是的，您可以随时更改订阅计划，费用将按比例调整。</p>
        </div>
      </div>
    </section>
  `;
}

// Subscription 功能逻辑
export function initSubscription(clerk) {
  console.log('Initializing subscription page');

  const upgradeButton = document.getElementById('upgradeToPro');

  if (upgradeButton) {
    upgradeButton.addEventListener('click', async () => {
      try {
        upgradeButton.disabled = true;
        upgradeButton.textContent = '处理中...';

        // 使用 Clerk 的订阅功能
        // 注意：这需要在 Clerk Dashboard 中配置 Billing
        const session = await clerk.session;

        if (!session) {
          alert('请先登录');
          return;
        }

        // 创建订阅会话
        // 这里需要您在 Clerk Dashboard 中配置产品和价格
        const checkoutUrl = await createCheckoutSession(clerk);

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          alert('暂时无法处理订阅，请稍后再试');
        }

      } catch (error) {
        console.error('Subscription error:', error);
        alert('订阅失败，请稍后再试');
      } finally {
        upgradeButton.disabled = false;
        upgradeButton.textContent = '升级到 Pro';
      }
    });
  }

  // 检查当前订阅状态
  checkSubscriptionStatus(clerk);
}

// 创建 Checkout 会话
async function createCheckoutSession(clerk) {
  try {
    const token = await clerk.session.getToken();

    // 调用后端 API 创建 Stripe Checkout 会话
    const response = await fetch('http://localhost:3001/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: 'cplan_3CA0KSiMydMyeHCHv6H3s5SK3SP',
        priceId: 'price_1TLMdcFhjD4vnEGKBBoWgoDx',
        successUrl: window.location.origin + '/#subscription?success=true',
        cancelUrl: window.location.origin + '/#subscription?canceled=true',
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data.checkoutUrl;

  } catch (error) {
    console.error('Failed to create checkout session:', error);
    alert('订阅功能需要启动后端服务器。\n\n请运行: npm run server');
    return null;
  }
}

// 检查订阅状态
async function checkSubscriptionStatus(clerk) {
  try {
    const user = clerk.user;

    if (!user) return;

    // 检查用户的订阅状态
    // 这需要从 Clerk 的用户元数据或订阅 API 中获取
    const subscription = user.publicMetadata?.subscription;

    if (subscription?.plan === 'pro') {
      // 用户已订阅 Pro
      const currentButton = document.querySelector('.plan-button.current');
      const proButton = document.getElementById('upgradeToPro');

      if (currentButton) {
        currentButton.classList.remove('current');
        currentButton.disabled = false;
        currentButton.textContent = '降级到免费';
      }

      if (proButton) {
        proButton.classList.add('current');
        proButton.disabled = true;
        proButton.textContent = '当前计划';
      }
    }

  } catch (error) {
    console.error('Failed to check subscription status:', error);
  }
}
