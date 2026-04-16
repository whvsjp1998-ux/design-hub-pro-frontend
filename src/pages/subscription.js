import { t } from '../utils/i18n.js';
import { getSubscriptionPlan, isProUser, getRemainingQuota, getQuotaResetTime, getDaysRemaining, getSubscriptionExpiry } from '../utils/proGuard.js';

const GUMROAD_PRODUCT_URL = 'https://whimsical2103.gumroad.com/l/designhubpro';

const subscriptionStyles = `
.subscription-page {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.subscription-hero {
  text-align: center;
  margin-bottom: 6rem;
}

.subscription-hero h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  color: #e5e2e1;
  line-height: 1.1;
}

.subscription-hero p {
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: #c2c6d6;
  max-width: 48rem;
  margin: 0 auto;
  font-weight: 300;
  line-height: 1.6;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 8rem;
  align-items: stretch;
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}

.pricing-card {
  background: #2a2a2a;
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-4px);
}

.pricing-card.best-value {
  background: #353534;
  outline: 1px solid rgba(66, 71, 84, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.plan-badge {
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.plan-badge.popular {
  background: #304671;
  color: #9fb5e7;
}

.plan-badge.best-value {
  background: linear-gradient(135deg, #adc6ff 0%, #4d8eff 100%);
  color: #002e6a;
}

.plan-badge.recommended {
  background: #e5e2e1;
  color: #131313;
}

.plan-tier-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8c909f;
  margin-bottom: 1rem;
  display: block;
}

.pricing-card.best-value .plan-tier-label {
  color: #adc6ff;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e5e2e1;
  margin: 0 0 0.5rem;
}

.plan-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.plan-price-amount {
  font-size: 2.25rem;
  font-weight: 900;
  color: #e5e2e1;
}

.plan-price-period {
  color: #c2c6d6;
  font-size: 0.875rem;
}

.plan-savings {
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffb786;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.plan-quota-text {
  font-size: 0.75rem;
  color: #adc6ff;
  font-weight: 500;
  margin-top: 0.25rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #c2c6d6;
}

.plan-features li .check-icon {
  color: #adc6ff;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.plan-features li.disabled {
  color: rgba(140, 144, 159, 0.5);
  text-decoration: line-through;
}

.plan-features li.disabled .check-icon {
  color: rgba(140, 144, 159, 0.5);
}

.plan-button {
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;
  display: block;
  border: 1px solid #424754;
  background: transparent;
  color: #e5e2e1;
}

.plan-button:hover {
  background: #353534;
}

.plan-button.primary-gradient {
  background: linear-gradient(135deg, #adc6ff 0%, #4d8eff 100%);
  color: #002e6a;
  border: none;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(173, 198, 255, 0.2);
}

.plan-button.primary-gradient:hover {
  filter: brightness(1.1);
}

.plan-button.primary-gradient:active {
  transform: scale(0.95);
}

.plan-button.current-plan {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  pointer-events: none;
}

.quota-info-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(173, 198, 255, 0.08);
  border: 1px solid rgba(173, 198, 255, 0.15);
  border-radius: 0.75rem;
  margin-bottom: 3rem;
  font-size: 0.9rem;
  color: #c2c6d6;
}

.quota-info-bar .quota-icon {
  font-size: 1.25rem;
}

.pro-status-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.25rem 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.75rem;
}

.pro-status-banner .status-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.pro-status-banner h3 {
  margin: 0;
  color: #10b981;
  font-size: 1rem;
}

.pro-status-banner p {
  margin: 0.25rem 0 0;
  color: #c2c6d6;
  font-size: 0.875rem;
}

.faq-section {
  max-width: 56rem;
  margin: 0 auto;
}

.faq-section h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #e5e2e1;
  text-align: center;
  margin-bottom: 4rem;
}

.faq-item {
  cursor: pointer;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(66, 71, 84, 0.3);
  margin-bottom: 2.5rem;
  transition: all 0.2s;
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  transition: margin-bottom 0.3s ease;
}

.faq-question h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e5e2e1;
  margin: 0;
}

.faq-toggle-icon {
  color: #8c909f;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-left: 1rem;
  user-select: none;
}

.faq-item:hover .faq-toggle-icon {
  color: #adc6ff;
}

.faq-item.open .faq-toggle-icon {
  transform: rotate(180deg);
  color: #adc6ff;
}

.faq-answer {
  color: #c2c6d6;
  line-height: 1.7;
  font-weight: 300;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease, margin-top 0.3s ease;
}

.faq-item.open .faq-answer {
  max-height: 200px;
  opacity: 1;
  margin-top: 1rem;
}

.faq-item.open .faq-question {
  margin-bottom: 0;
}
`;

const styleId = 'subscription-page-styles';

function ensureStyles() {
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = subscriptionStyles;
    document.head.appendChild(style);
  }
}

export function createSubscription() {
  ensureStyles();

  return `
    <section class="subscription-page">
      <header class="subscription-hero">
        <h1>Elevate Your Workflow</h1>
        <p>Premium access to high-speed processing and unlimited quotas.</p>
      </header>

      <div class="quota-info-bar" id="quotaInfoBar">
        <div class="quota-icon">📊</div>
        <div class="quota-text">
          <span id="quotaDisplay">Loading...</span>
        </div>
      </div>

      <div class="pricing-grid">
        <div class="pricing-card">
          <span class="plan-tier-label">ESSENTIAL</span>
          <h3 class="plan-name">Free</h3>
          <div class="plan-price-row">
            <span class="plan-price-amount">$0</span>
            <span class="plan-price-period">/forever</span>
          </div>
          <p class="plan-quota-text">每日额度 10 张/天</p>
          <ul class="plan-features">
            <li><span class="check-icon">✓</span> 10 image recognitions / day</li>
            <li><span class="check-icon">✓</span> Basic recognition mode</li>
            <li><span class="check-icon">✓</span> Standard processing speed</li>
            <li class="disabled"><span class="check-icon">✗</span> Batch processing</li>
            <li class="disabled"><span class="check-icon">✗</span> Custom prompts</li>
            <li class="disabled"><span class="check-icon">✗</span> Priority support</li>
          </ul>
          <button class="plan-button" data-plan="free">Get Started</button>
        </div>

        <div class="pricing-card">
          <div class="plan-badge popular">Popular</div>
          <span class="plan-tier-label">PROFESSIONAL</span>
          <h3 class="plan-name">Monthly</h3>
          <div class="plan-price-row">
            <span class="plan-price-amount">$9.9</span>
            <span class="plan-price-period">/month</span>
          </div>
          <p class="plan-quota-text">每月额度 500 张/月</p>
          <ul class="plan-features">
            <li><span class="check-icon">✓</span> 500 image recognitions / month</li>
            <li><span class="check-icon">✓</span> All recognition modes</li>
            <li><span class="check-icon">✓</span> High-speed processing</li>
            <li><span class="check-icon">✓</span> Batch processing</li>
            <li><span class="check-icon">✓</span> Custom prompts</li>
            <li><span class="check-icon">✓</span> Priority email support</li>
          </ul>
          <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener" class="plan-button" data-plan="monthly">
            Subscribe Monthly
          </a>
        </div>

        <div class="pricing-card best-value">
          <div class="plan-badge best-value">Best Value</div>
          <span class="plan-tier-label">POWER USER</span>
          <h3 class="plan-name">Quarterly</h3>
          <div class="plan-price-row">
            <span class="plan-price-amount">$25</span>
            <span class="plan-price-period">/3 months</span>
            <span class="plan-savings">Save 16%</span>
          </div>
          <p class="plan-quota-text">每月额度 2000 张/月</p>
          <ul class="plan-features">
            <li><span class="check-icon">✓</span> 2000 image recognitions / month</li>
            <li><span class="check-icon">✓</span> All recognition modes</li>
            <li><span class="check-icon">✓</span> High-speed processing</li>
            <li><span class="check-icon">✓</span> Batch processing</li>
            <li><span class="check-icon">✓</span> Custom prompts</li>
            <li><span class="check-icon">✓</span> Priority email support</li>
          </ul>
          <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener" class="plan-button primary-gradient" data-plan="quarterly">
            Subscribe Quarterly
          </a>
        </div>

        <div class="pricing-card">
          <div class="plan-badge recommended">Recommended</div>
          <span class="plan-tier-label">ENTERPRISE</span>
          <h3 class="plan-name">Yearly</h3>
          <div class="plan-price-row">
            <span class="plan-price-amount">$89</span>
            <span class="plan-price-period">/year</span>
            <span class="plan-savings">Save 25%</span>
          </div>
          <p class="plan-quota-text">每月额度 无限制</p>
          <ul class="plan-features">
            <li><span class="check-icon">✓</span> Unlimited image recognition</li>
            <li><span class="check-icon">✓</span> All recognition modes</li>
            <li><span class="check-icon">✓</span> High-speed processing</li>
            <li><span class="check-icon">✓</span> Batch processing</li>
            <li><span class="check-icon">✓</span> Custom prompts</li>
            <li><span class="check-icon">✓</span> 24/7 Priority support</li>
          </ul>
          <a href="${GUMROAD_PRODUCT_URL}" target="_blank" rel="noopener" class="plan-button" data-plan="yearly">
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

      <section class="faq-section">
        <h2>FAQ</h2>
        <div class="faq-item" data-faq="0">
          <div class="faq-question">
            <h4>How does the purchase work?</h4>
            <span class="faq-toggle-icon">▼</span>
          </div>
          <div class="faq-answer">
            Click any subscription plan to purchase via Gumroad. After payment, your account will be automatically upgraded. Please ensure you use the same email as your Design Hub Pro account.
          </div>
        </div>
        <div class="faq-item" data-faq="1">
          <div class="faq-question">
            <h4>What payment methods are supported?</h4>
            <span class="faq-toggle-icon">▼</span>
          </div>
          <div class="faq-answer">
            Gumroad supports credit cards, debit cards, PayPal, Apple Pay, and Google Pay.
          </div>
        </div>
        <div class="faq-item" data-faq="2">
          <div class="faq-question">
            <h4>How is the quota calculated?</h4>
            <span class="faq-toggle-icon">▼</span>
          </div>
          <div class="faq-answer">
            Quota is calculated based on your subscription tier. Free users get 10 images per day, Monthly gets 500/month, Quarterly gets 2000/month, and Yearly gets unlimited access.
          </div>
        </div>
        <div class="faq-item" data-faq="3">
          <div class="faq-question">
            <h4>What happens when I run out of quota?</h4>
            <span class="faq-toggle-icon">▼</span>
          </div>
          <div class="faq-answer">
            You can wait for the next reset period (daily for free, monthly for paid plans) or upgrade to a higher tier.
          </div>
        </div>
        <div class="faq-item" data-faq="4">
          <div class="faq-question">
            <h4>My subscription hasn't been activated after payment?</h4>
            <span class="faq-toggle-icon">▼</span>
          </div>
          <div class="faq-answer">
            Please make sure the email used for the Gumroad purchase matches your Design Hub Pro account email. If the issue persists, contact support with your purchase confirmation.
          </div>
        </div>
      </section>
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
  initFaqToggle();

  function updateQuotaDisplay() {
    if (!quotaDisplay) return;
    const plan = getSubscriptionPlan(clerk);
    const remaining = getRemainingQuota(clerk);
    const resetTime = getQuotaResetTime(clerk);
    const daysRemaining = getDaysRemaining(clerk);
    const expiry = getSubscriptionExpiry(clerk);

    if (plan === 'free') {
      quotaDisplay.innerHTML = `
        <strong>Free Plan</strong> — ${remaining} remaining / today
        <span style="color: #8c909f; font-size: 0.85em; margin-left: 0.5rem;">
          (resets at ${resetTime})
        </span>
      `;
    } else if (plan === 'unlimited') {
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : '长期有效';
      quotaDisplay.innerHTML = `
        <strong>Yearly Plan</strong> — Unlimited access
        <span style="color: #8c909f; font-size: 0.85em; margin-left: 0.5rem;">
          (expires: ${expiryDate}, ${daysRemaining} days left)
        </span>
      `;
    } else if (plan === 'monthly') {
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : resetTime;
      quotaDisplay.innerHTML = `
        <strong>Monthly Plan</strong> — ${remaining} remaining / this month
        <span style="color: #8c909f; font-size: 0.85em; margin-left: 0.5rem;">
          (expires: ${expiryDate}, ${daysRemaining} days left)
        </span>
      `;
    } else if (plan === 'quarterly') {
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : resetTime;
      quotaDisplay.innerHTML = `
        <strong>Quarterly Plan</strong> — ${remaining} remaining / this quarter
        <span style="color: #8c909f; font-size: 0.85em; margin-left: 0.5rem;">
          (expires: ${expiryDate}, ${daysRemaining} days left)
        </span>
      `;
    }
  }

  function updatePlanButtons() {
    const currentPlan = getSubscriptionPlan(clerk);
    const buttons = document.querySelectorAll('.plan-button[data-plan]');

    buttons.forEach(btn => {
      const plan = btn.dataset.plan;

      if (plan === 'free' && currentPlan === 'free') {
        btn.textContent = '✓ Current Plan';
        btn.classList.add('current-plan');
        btn.disabled = true;
      } else if (plan === 'monthly' && currentPlan === 'monthly') {
        btn.textContent = '✓ Current Plan';
        btn.classList.add('current-plan');
        btn.style.pointerEvents = 'none';
      } else if (plan === 'quarterly' && currentPlan === 'quarterly') {
        btn.textContent = '✓ Current Plan';
        btn.classList.remove('primary-gradient');
        btn.classList.add('current-plan');
        btn.style.pointerEvents = 'none';
      } else if (plan === 'yearly' && currentPlan === 'unlimited') {
        btn.textContent = '✓ Current Plan';
        btn.classList.add('current-plan');
        btn.style.pointerEvents = 'none';
      }
    });
  }

  function initFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      item.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
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
        proDesc.textContent = `Unlimited access — expires: ${expiryDate} (${daysRemaining} days left)`;
      } else if (plan === 'monthly') {
        proTitle.textContent = 'Monthly Plan Active';
        proDesc.textContent = `500/month — expires: ${expiryDate} (${daysRemaining} days left)`;
      } else if (plan === 'quarterly') {
        proTitle.textContent = 'Quarterly Plan Active';
        proDesc.textContent = `2000/month — expires: ${expiryDate} (${daysRemaining} days left)`;
      }
    }
  }
}
