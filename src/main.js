import { Clerk } from '@clerk/clerk-js';
import './style.css';
import { createDashboard, initDashboard } from './pages/dashboard.js';
import { createProjects, initProjects } from './pages/projects.js';
import { createApiSettings, initApiSettings } from './pages/apiSettings.js';
import { createSubscription, initSubscription } from './pages/subscription.js';
import { createPrivacyPolicy, initPrivacyPolicy } from './pages/privacy.js';
import { createTermsOfService, initTermsOfService } from './pages/terms.js';
import { t, setLanguage, getCurrentLanguage } from './utils/i18n.js';

console.log('Main.js loaded');

// 主题管理
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  },

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
};

// 初始化主题
ThemeManager.init();

// 注入主题样式
const themeStyles = document.createElement('style');
themeStyles.textContent = `
  :root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #111827;
    --bg-tertiary: #1f2937;
    --bg-hover: #374151;
    --text-primary: #ffffff;
    --text-secondary: #9ca3af;
    --text-tertiary: #6b7280;
    --border-color: #1f2937;
  }

  :root[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --bg-tertiary: #f3f4f6;
    --bg-hover: #e5e7eb;
    --text-primary: #111827;
    --text-secondary: #4b5563;
    --text-tertiary: #6b7280;
    --border-color: #e5e7eb;
  }

  /* 应用主题变量到关键元素 */
  body, #app {
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .app-header {
    background: var(--bg-primary);
    border-bottom-color: var(--border-color);
  }

  .app-title {
    color: var(--text-primary) !important;
  }

  .nav-link {
    color: var(--text-secondary) !important;
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--text-primary) !important;
  }

  .dashboard-right,
  .provider-card,
  .api-config-form,
  .records-table-container {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }

  .lang-button,
  .theme-toggle {
    color: var(--text-secondary);
  }

  .lang-dropdown {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .theme-toggle:hover {
    background: var(--bg-tertiary);
  }

  .theme-toggle svg {
    width: 20px;
    height: 20px;
  }

  /* 上传区域的 + 号 */
  .image-display {
    cursor: pointer;
    position: relative;
  }

  .drop-zone-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .upload-plus {
    font-size: 120px;
    font-weight: 200;
    color: var(--text-tertiary);
    line-height: 1;
    margin-bottom: 1rem;
    transition: all 0.3s;
  }

  .image-display:hover .upload-plus {
    color: var(--accent-primary);
    transform: scale(1.1);
  }

  .drop-zone-hint p {
    color: var(--text-tertiary);
    margin: 0;
  }

  /* 订阅页面样式 */
  .subscription-page {
    max-width: 1200px;
    width: 100%;
  }

  .subscription-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .pricing-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .pricing-card {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    position: relative;
    transition: all 0.3s;
  }

  .pricing-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .pricing-card.featured {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  .plan-badge {
    position: absolute;
    top: -12px;
    right: 20px;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .plan-badge.free {
    background: var(--bg-hover);
    color: var(--text-secondary);
  }

  .plan-badge.pro {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }

  .plan-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 1rem 0;
  }

  .plan-price {
    margin: 1.5rem 0;
  }

  .plan-price .price {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .plan-price .period {
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .plan-features {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
  }

  .plan-features li {
    padding: 0.75rem 0;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-color);
  }

  .plan-features li:last-child {
    border-bottom: none;
  }

  .plan-button {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .plan-button.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }

  .plan-button.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .plan-button.current {
    background: var(--bg-hover);
    color: var(--text-secondary);
    cursor: not-allowed;
  }

  .plan-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .subscription-info {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
  }

  .subscription-info h3 {
    color: var(--text-primary);
    margin-top: 0;
  }

  .faq-item {
    margin: 1.5rem 0;
  }

  .faq-item h4 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .faq-item p {
    color: var(--text-secondary);
    margin: 0;
  }
`;
document.head.appendChild(themeStyles);

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Add your VITE_CLERK_PUBLISHABLE_KEY to the .env file');
}

console.log('Starting Clerk initialization...');

// 解析 Clerk 域名
const clerkDomain = atob(publishableKey.split('_')[2]).slice(0, -1);

// 加载 Clerk UI bundle
try {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load @clerk/ui bundle'));
    document.head.appendChild(script);
  });
  console.log('Clerk UI bundle loaded');
} catch (error) {
  console.error('Failed to load Clerk UI:', error);
  document.getElementById('app').innerHTML = `
    <div class="container">
      <h1>Design Hub Pro</h1>
      <p style="color: #ef4444;">登录系统加载失败，请刷新页面重试</p>
    </div>
  `;
  throw error;
}

// 初始化 Clerk
const clerk = new Clerk(publishableKey);
await clerk.load({
  ui: { ClerkUI: window.__internal_ClerkUICtor },
});

console.log('Clerk initialized successfully');

// 防止重复渲染的标志
let isRendering = false;

// 根据登录状态显示不同内容
if (clerk.user) {
  console.log('User is signed in');
  showMainApp(clerk);
} else {
  console.log('User is not signed in');
  showSignIn(clerk);
}

// 监听登录状态变化（只监听一次，避免循环）
clerk.addListener((state) => {
  if (isRendering) return; // 防止重复渲染

  console.log('Clerk state changed:', state.user ? 'signed in' : 'signed out');

  if (state.user && !document.querySelector('.main-app')) {
    // 用户登录且当前不是主应用界面
    showMainApp(clerk);
  } else if (!state.user && !document.querySelector('#sign-in')) {
    // 用户登出且当前不是登录界面
    showSignIn(clerk);
  }
});

// 显示登录界面
function showSignIn(clerk) {
  if (isRendering) return;
  isRendering = true;

  document.getElementById('app').innerHTML = `
    <div class="container">
      <h1>Design Hub Pro</h1>
      <p>请登录以继续使用图像识别服务</p>
      <div id="sign-in"></div>
    </div>
  `;

  const signInDiv = document.getElementById('sign-in');
  clerk.mountSignIn(signInDiv);

  isRendering = false;
}

// 显示主应用界面
function showMainApp(clerk) {
  if (isRendering) return;
  isRendering = true;

  let currentPage = 'dashboard';

  document.getElementById('app').innerHTML = `
    <div class="main-app">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">Design Hub Pro</h1>
          <nav class="app-nav">
            <a href="#dashboard" class="nav-link active" data-page="dashboard">${t('nav.dashboard')}</a>
            <a href="#projects" class="nav-link" data-page="projects">${t('nav.projects')}</a>
            <a href="#subscription" class="nav-link" data-page="subscription">订阅</a>
          </nav>
          <div class="header-right">
            <button id="themeToggle" class="theme-toggle" title="切换主题">
              <svg id="themeIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            <div class="lang-selector">
              <button id="langButton" class="lang-button">
                <span id="currentLangFlag">${getCurrentLanguage() === 'zh-CN' ? '🇨🇳' : '🇺🇸'}</span>
                <svg class="lang-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div id="langDropdown" class="lang-dropdown hidden">
                <button onclick="changeLang('zh-CN', '🇨🇳')" class="lang-option">
                  <span>🇨🇳</span>
                  <span>简体中文</span>
                </button>
                <button onclick="changeLang('en', '🇺🇸')" class="lang-option">
                  <span>🇺🇸</span>
                  <span>English</span>
                </button>
              </div>
            </div>
            <div id="user-button" class="user-button-container"></div>
          </div>
        </div>
      </header>

      <main class="app-main" id="app-main">
        ${createDashboard()}
      </main>

      <footer class="app-footer">
        <div class="footer-content">
          <p class="footer-text">© 2026 Design Hub Pro. All rights reserved.</p>
          <div class="footer-links">
            <a href="#privacy" class="footer-link" data-page="privacy">Privacy Policy</a>
            <span class="footer-separator">|</span>
            <a href="#terms" class="footer-link" data-page="terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  // 挂载用户按钮
  const userButtonDiv = document.getElementById('user-button');
  clerk.mountUserButton(userButtonDiv);

  // 初始化 Dashboard
  initDashboard();

  // 语言切换功能
  const langButton = document.getElementById('langButton');
  const langDropdown = document.getElementById('langDropdown');

  if (langButton && langDropdown) {
    langButton.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('hidden');
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-selector')) {
        langDropdown.classList.add('hidden');
      }
    });
  }

  // 全局语言切换函数
  window.changeLang = function(lang, flag) {
    setLanguage(lang);
    langDropdown?.classList.add('hidden');

    // 重新渲染整个应用以应用新语言
    isRendering = false; // 重置标志以允许重新渲染
    showMainApp(clerk);
  };

  // 主题切换功能
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // 更新图标
  function updateThemeIcon() {
    const currentTheme = ThemeManager.getCurrentTheme();
    if (currentTheme === 'light') {
      // 太阳图标 (浅色模式)
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
    } else {
      // 月亮图标 (深色模式)
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
    }
  }

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      ThemeManager.toggle();
      updateThemeIcon();
    });
  }

  // 页面导航 (包括 header nav-links 和 footer links)
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page === currentPage) return;

      currentPage = page;

      // 更新导航状态
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // 切换页面内容
      const mainContent = document.getElementById('app-main');
      switch (page) {
        case 'dashboard':
          mainContent.innerHTML = createDashboard();
          initDashboard();
          break;
        case 'projects':
          mainContent.innerHTML = createProjects();
          initProjects();
          break;
        case 'subscription':
          mainContent.innerHTML = createSubscription();
          initSubscription(clerk);
          break;
        case 'privacy':
          mainContent.innerHTML = createPrivacyPolicy();
          initPrivacyPolicy();
          break;
        case 'terms':
          mainContent.innerHTML = createTermsOfService();
          initTermsOfService();
          break;
      }
    });
  });

  isRendering = false;
}
