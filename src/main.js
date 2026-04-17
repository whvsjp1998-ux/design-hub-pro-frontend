import { Clerk } from '@clerk/clerk-js';
import './style.css';
import { createDashboard, initDashboard } from './pages/dashboard.js';
import { createProjects, initProjects } from './pages/projects.js';
import { createApiSettings, initApiSettings } from './pages/apiSettings.js';
import { createSubscription, initSubscription } from './pages/subscription.js';
import { createPrivacyPolicy, initPrivacyPolicy } from './pages/privacy.js';
import { createTermsOfService, initTermsOfService } from './pages/terms.js';
import { t, setLanguage, getCurrentLanguage } from './utils/i18n.js';
import { isProUser } from './utils/proGuard.js';

console.log('Main.js loaded');

const ALL_ROUTES = ['home', 'dashboard', 'projects', 'subscription', 'privacy', 'terms'];

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

ThemeManager.init();

// 注入主题样式（简化版，保留原有核心样式）
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
  body, #app { background: var(--bg-primary); color: var(--text-primary); }
  .app-header { background: var(--bg-primary); border-bottom-color: var(--border-color); }
  .app-title { color: var(--text-primary) !important; }
  .nav-link { color: var(--text-secondary) !important; }
  .nav-link:hover, .nav-link.active { color: var(--text-primary) !important; }
  .dashboard-right, .provider-card, .api-config-form, .records-table-container {
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
    color: var(--text-secondary);
  }
  .theme-toggle:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .theme-toggle svg { width: 20px; height: 20px; }
  .lang-dropdown { background: var(--bg-secondary); border-color: var(--border-color); }

  /* 公开首页样式 */
  .landing-page { min-height: 100vh; display: flex; flex-direction: column; }
  .landing-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }
  .landing-hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .landing-hero p { font-size: 1.25rem; color: var(--text-secondary); max-width: 600px; margin-bottom: 2rem; }
  .cta-button {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  .cta-button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
    max-width: 1000px;
    width: 100%;
  }
  .feature-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: left;
  }
  .pro-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.6rem;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    border-radius: 0.375rem;
    letter-spacing: 0.05em;
    margin-right: 0.5rem;
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
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;
document.head.appendChild(themeStyles);

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Add your VITE_CLERK_PUBLISHABLE_KEY to the .env file');
}

console.log('Starting Clerk initialization...');

const clerkDomain = atob(publishableKey.split('_')[2]).slice(0, -1);

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

const clerk = new Clerk(publishableKey);
await clerk.load({
  ui: { ClerkUI: window.__internal_ClerkUICtor },
});

console.log('Clerk initialized successfully');

let isRendering = false;
let currentPage = 'home';

function handleRouteChange() {
  const hash = window.location.hash.slice(1) || 'home';
  
  if (ALL_ROUTES.includes(hash)) {
    currentPage = hash;
  } else {
    currentPage = 'home';
  }

  if (currentPage === 'home' || currentPage === 'privacy' || currentPage === 'terms') {
    showPublicPage(currentPage);
  } else {
    showMainApp(clerk, currentPage);
  }
}

// 显示公开页面
function showPublicPage(page) {
  if (isRendering) return;
  isRendering = true;

  const app = document.getElementById('app');

  switch (page) {
    case 'home':
      app.innerHTML = createLandingPage();
      initLandingPage();
      break;
    case 'privacy':
      app.innerHTML = createPrivacyPolicy();
      initPrivacyPolicy();
      break;
    case 'terms':
      app.innerHTML = createTermsOfService();
      initTermsOfService();
      break;
    case 'subscription':
      app.innerHTML = createSubscription();
      break;
    default:
      app.innerHTML = createLandingPage();
      initLandingPage();
  }

  isRendering = false;
}

// 初始化公开首页
function initLandingPage() {
  setupHeaderControls();
}

// 创建公开首页
function createLandingPage() {
  return `
    <div class="landing-page">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">Design Hub Pro</h1>
          <nav class="app-nav">
            <a href="#home" class="nav-link ${currentPage === 'home' ? 'active' : ''}" data-page="home">Home</a>
            <a href="#subscription" class="nav-link" data-page="subscription">Pricing</a>
          </nav>
          <div class="header-right">
            <button id="themeToggle" class="theme-toggle">
              <svg id="themeIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            <button id="signInBtn" class="cta-button" style="margin-left: 1rem; padding: 0.5rem 1rem;">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main class="landing-hero">
        <h1>AI Batch Image Renamer & SEO Optimizer</h1>
        <p>Intelligently rename and optimize your images in bulk with AI — boost SEO and workflow efficiency</p>
        <button class="cta-button" onclick="navigateTo('dashboard')">
          Get Started
        </button>

        <div class="feature-grid">
          <div class="feature-card">
            <h3>🤖 AI Smart Recognition</h3>
            <p>Automatically identify image content with advanced AI technology</p>
          </div>
          <div class="feature-card">
            <h3>📁 Batch Processing</h3>
            <p>Process multiple images at once — 10x efficiency boost</p>
          </div>
          <div class="feature-card">
            <h3>🎯 99% Recognition Rate</h3>
            <p>Industry-leading accuracy for reliable, consistent results</p>
          </div>
        </div>
      </main>

      <footer class="app-footer">
        <div class="footer-content">
          <p class="footer-text">© 2026 Design Hub Pro. All rights reserved.</p>
          <div class="footer-links">
            <a href="#privacy" class="footer-link">Privacy Policy</a>
            <span class="footer-separator">|</span>
            <a href="#terms" class="footer-link">Terms of Service</a>
            <span class="footer-separator">|</span>
            <a href="#subscription" class="footer-link">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  `;
}

function showMainApp(clerk, page = 'dashboard') {
  if (isRendering) return;
  isRendering = true;

  const isLoggedIn = !!clerk.user;
  const proBadge = isLoggedIn && isProUser(clerk)
    ? '<span class="pro-badge">PRO</span>'
    : '';
  const userButtonHtml = isLoggedIn 
    ? `${proBadge}<div id="user-button" class="user-button-container"></div>`
    : '<button id="signInBtn" class="cta-button" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Sign In</button>';

  document.getElementById('app').innerHTML = `
    <div class="main-app">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">Design Hub Pro</h1>
          <nav class="app-nav">
            <a href="#dashboard" class="nav-link ${page === 'dashboard' ? 'active' : ''}" data-page="dashboard">Dashboard</a>
            <a href="#projects" class="nav-link ${page === 'projects' ? 'active' : ''}" data-page="projects">Projects</a>
            <a href="#subscription" class="nav-link ${page === 'subscription' ? 'active' : ''}" data-page="subscription">Subscription</a>
          </nav>
          <div class="header-right">
            <button id="themeToggle" class="theme-toggle">
              <svg id="themeIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            ${userButtonHtml}
          </div>
        </div>
      </header>

      <main class="app-main" id="app-main">
        ${getPageContent(page, clerk)}
      </main>

      <footer class="app-footer">
        <div class="footer-content">
          <p class="footer-text">© 2026 Design Hub Pro. All rights reserved.</p>
          <div class="footer-links">
            <a href="#privacy" class="footer-link">Privacy Policy</a>
            <span class="footer-separator">|</span>
            <a href="#terms" class="footer-link">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  if (isLoggedIn) {
    const userButtonDiv = document.getElementById('user-button');
    if (userButtonDiv) {
      clerk.mountUserButton(userButtonDiv);
    }
  }

  setupHeaderControls();
  initPage(page, clerk);
  setupNavigation();
  isRendering = false;
}

// 设置头部控制（主题切换等）
function setupHeaderControls() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function updateThemeIcon() {
    if (themeIcon) {
      const currentTheme = ThemeManager.getCurrentTheme();
      if (currentTheme === 'light') {
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
      } else {
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
      }
    }
  }

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      ThemeManager.toggle();
      updateThemeIcon();
    });
  }

  // 登录按钮
  const signInBtn = document.getElementById('signInBtn');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.id = 'sign-in-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;';
      modal.innerHTML = '<div id="sign-in"></div><button id="closeModal" style="position:absolute;top:20px;right:20px;background:#333;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">Close</button>';
      document.body.appendChild(modal);
      const signInDiv = document.getElementById('sign-in');
      clerk.mountSignIn(signInDiv);
      document.getElementById('closeModal').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    });
  }
}

// 获取页面内容
function getPageContent(page, clerk) {
  switch (page) {
    case 'dashboard': return createDashboard();
    case 'projects': return createProjects();
    case 'apiSettings': return createApiSettings();
    case 'subscription': return createSubscription();
    case 'privacy': return createPrivacyPolicy();
    case 'terms': return createTermsOfService();
    default: return createDashboard();
  }
}

// 初始化页面
function initPage(page, clerk) {
  switch (page) {
    case 'dashboard': initDashboard(clerk); break;
    case 'projects': initProjects(); break;
    case 'subscription': initSubscription(clerk); break;
    case 'privacy': initPrivacyPolicy(); break;
    case 'terms': initTermsOfService(); break;
  }
}

// 设置导航
function setupNavigation() {
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });
}

// 导航函数
window.navigateTo = function(page) {
  window.location.hash = '#' + page;
};

// 监听路由变化
window.addEventListener('hashchange', handleRouteChange);

// 监听登录状态
clerk.addListener((state) => {
  if (!isRendering) {
    handleRouteChange();
  }
});

// 初始化
handleRouteChange();