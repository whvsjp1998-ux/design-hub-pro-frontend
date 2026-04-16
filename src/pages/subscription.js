import { t } from '../utils/i18n.js';
import { getSubscriptionPlan, isProUser, getRemainingQuota, getQuotaResetTime, getDaysRemaining, getSubscriptionExpiry } from '../utils/proGuard.js';

const GUMROAD_PRODUCT_URL = 'https://whimsical2103.gumroad.com/l/designhubpro';

export function createSubscription() {
  return `
    <section class="subscription-page">
      <div class="subscription-header">
        <h1 class="page-title">${t('subscription.title') || '订阅计划'}</h1>
        <p class="page-subtitle">${t('subscription.subtitle') || '选择适合您的计划'}</p>
      </div>

      <div class="quota-info-bar" id="quotaInfoBar">
        <div class="quota-icon">📊</div>
        <div class="quota-text">
          <span id="quotaDisplay">加载中...</span>
        </div>
      </div>

      <div class="pricing-cards">
        <div class="pricing-card">
          <div class="plan-badge free">Free</div>
          <h3 class="plan-name">Free</h3>
          <div class="plan-price">
            <span class="price">$0</span>
            <span class="period">/forever</span>
          </div>
          <div class="plan-quota">
            <span class="quota-label">每日额度</span>
            <span class="quota-value">10 张/天</span>
          </div>
          <ul class="plan-features">
            <li>✓ 10 image recognitions / day</li>
            <li>✓ Basic recognition mode</li>
            <li>✓ Standard processing speed</li>
            <li>✗ Batch processing</li>
            <li>✗ Custom prompts</li>
            <li>✗ Priority support</li>
          </ul>
          <button class="plan-button current" disabled>Current Plan</button>
        </div>

        <div class="pricing-card">
          <div class="plan-badge monthly">Popular</div>
          <h3 class="plan-name">Monthly</h3>
          <div class="plan-price">
            <span class="price">$9.9</span>
            <span class="period">/month</span>
          </div>
          <div class="plan-quota">
            <span class="quota-label">每月额度</span>
            <span class="quota-value">500 张/月</span>
          </div>
          <ul class="plan-features">
            <li>✓ 500 image recognitions / month</li>
            <li>✓ All recognition modes</li>
            <li>✓ High-speed processing</li>
            <li>✓ Batch processing</li>
            <li>✓ Custom prompts</li>
            <li>✓ Priority email support</li>
          </ul>
          <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener" class="plan-button primary" data-plan="monthly">
            Subscribe Monthly
          </a>
        </div>

        <div class="pricing-card">
          <div class="plan-badge quarterly">Best Value</div>
          <h3 class="plan-name">Quarterly</h3>
          <div class="plan-price">
            <span class="price">$25</span>
            <span class="period">/3 months</span>
          </div>
          <div class="plan-quota">
            <span class="quota-label">每月额度</span>
            <span class="quota-value">2000 张/月</span>
          </div>
          <div class="plan-savings">
            <span class="savings-badge">Save 16%</span>
          </div>
          <ul class="plan-features">
            <li>✓ 2000 image recognitions / month</li>
            <li>✓ All recognition modes</li>
            <li>✓ High-speed processing</li>
            <li>✓ Batch processing</li>
            <li>✓ Custom prompts</li>
            <li>✓ Priority email support</li>
          </ul>
          <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener" class="plan-button primary" data-plan="quarterly">
            Subscribe Quarterly
          </a>
        </div>

        <div class="pricing-card featured">
          <div class="plan-badge pro">Recommended</div>
          <h3 class="plan-name">Yearly</h3>
          <div class="plan-price">
            <span class="price">$89</span>
            <span class="period">/year</span>
          </div>
          <div class="plan-quota">
            <span class="quota-label">每月额度</span>
            <span class="quota-value">无限制</span>
          </div>
          <div class="plan-savings">
            <span class="savings-badge">Save 25%</span>
          </div>
          <ul class="plan-features">
            <li>✓ Unlimited image recognition</li>
            <li>✓ All recognition modes</li>
            <li>✓ High-speed processing</li>
            <li>✓ Batch processing</li>
            <li>✓ Custom prompts</li>
            <li>✓ 24/7 Priority support</li>
          </ul>
          <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener" class="plan-button primary featured-btn" data-plan="yearly">
            Subscribe Yearly
          </a>
        </div>
      </div>

      <div id="proStatusBanner" class="pro-status-banner" style="display:none;">
        <div class="status-icon">✓</div>
        <div>
          <h3 id="proStatusTitle">Pro Activated</h3>
          <p id="proStatusDesc">Your Pro subscription is active. All features are unlocked.</p>
        </div>
      </div>

      <div class="subscription-info">
        <h3>FAQ</h3>
        <div class="faq-item">
          <h4>How does the purchase work?</h4>
          <p>Click any subscription plan to purchase via Gumroad. After payment, your account will be automatically upgraded. Please ensure you use the same email as your Design Hub Pro account.</p>
        </div>
        <div class="faq-item">
          <h4>What payment methods are supported?</h4>
          <p>Gumroad supports credit cards, debit cards, PayPal, Apple Pay, and Google Pay.</p>
        </div>
        <div class="faq-item">
          <h4>How is the quota calculated?</h4>
          <p>Quota is calculated based on your subscription tier. Free users get 10 images per day, Monthly gets 500/month, Quarterly gets 2000/month, and Yearly gets unlimited access.</p>
        </div>
        <div class="faq-item">
          <h4>What happens when I run out of quota?</h4>
          <p>You can wait for the next reset period (daily for free, monthly for paid plans) or upgrade to a higher tier.</p>
        </div>
        <div class="faq-item">
          <h4>My subscription hasn't been activated after payment?</h4>
          <p>Please make sure the email used for the Gumroad purchase matches your Design Hub Pro account email. If the issue persists, contact support with your purchase confirmation.</p>
        </div>
      </div>
    </section>
  `;
}

export function initSubscription(clerk) {
  const proBanner = document.getElementById('proStatusBanner');
  const proTitle = document.getElementById('proStatusTitle');
  const proDesc = document.getElementById('proStatusDesc');
  const quotaDisplay = document.getElementById('quotaDisplay');

  updateQuotaDisplay();
  updatePlanButtons();

  function updateQuotaDisplay() {
    const plan = getSubscriptionPlan(clerk);
    const remaining = getRemainingQuota(clerk);
    const resetTime = getQuotaResetTime(clerk);
    const daysRemaining = getDaysRemaining(clerk);
    const expiry = getSubscriptionExpiry(clerk);

    if (plan === 'free') {
      quotaDisplay.innerHTML = `
        <strong>Free Plan</strong> — ${remaining} 次剩余 / 今日
        <span style="color: var(--text-secondary); font-size: 0.85em; margin-left: 0.5rem;">
          (重置于 ${resetTime})
        </span>
      `;
    } else if (plan === 'unlimited') {
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : '长期有效';
      quotaDisplay.innerHTML = `
        <strong>Yearly Plan</strong> — 无限制访问
        <span style="color: var(--text-secondary); font-size: 0.85em; margin-left: 0.5rem;">
          (到期日: ${expiryDate}, 剩余 ${daysRemaining} 天)
        </span>
      `;
    } else if (plan === 'monthly') {
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : resetTime;
      quotaDisplay.innerHTML = `
        <strong>Monthly Plan</strong> — ${remaining} 次剩余 / 本月
        <span style="color: var(--text-secondary); font-size: 0.85em; margin-left: 0.5rem;">
          (到期日: ${expiryDate}, 剩余 ${daysRemaining} 天)
        </span>
      `;
    } else if (plan === 'quarterly') {
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : resetTime;
      quotaDisplay.innerHTML = `
        <strong>Quarterly Plan</strong> — ${remaining} 次剩余 / 本季
        <span style="color: var(--text-secondary); font-size: 0.85em; margin-left: 0.5rem;">
          (到期日: ${expiryDate}, 剩余 ${daysRemaining} 天)
        </span>
      `;
    }
  }

  function updatePlanButtons() {
    const currentPlan = getSubscriptionPlan(clerk);
    const buttons = document.querySelectorAll('.plan-button[data-plan]');

    buttons.forEach(btn => {
      const plan = btn.dataset.plan;
      if (currentPlan === plan) {
        btn.textContent = '✓ Current Plan';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btn.style.pointerEvents = 'none';
      }
    });
  }

  if (isProUser(clerk)) {
    if (proBanner) proBanner.style.display = 'flex';
    if (proTitle) {
      const plan = getSubscriptionPlan(clerk);
      const daysRemaining = getDaysRemaining(clerk);
      const expiry = getSubscriptionExpiry(clerk);
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) : '长期有效';

      if (plan === 'unlimited') {
        proTitle.textContent = 'Yearly Plan Active';
        proDesc.textContent = `无限制访问 — 到期日: ${expiryDate} (剩余 ${daysRemaining} 天)`;
      } else if (plan === 'monthly') {
        proTitle.textContent = 'Monthly Plan Active';
        proDesc.textContent = `500 张/月 — 到期日: ${expiryDate} (剩余 ${daysRemaining} 天)`;
      } else if (plan === 'quarterly') {
        proTitle.textContent = 'Quarterly Plan Active';
        proDesc.textContent = `2000 张/月 — 到期日: ${expiryDate} (剩余 ${daysRemaining} 天)`;
      }
    }
  }
}
