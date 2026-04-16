// 导入多语言函数
import { t } from '../utils/i18n.js';

// API Settings 页面组件
export function createApiSettings() {
  return `
    <section class="api-settings-page">
      <h2 class="page-title">${t('apiSettings.title')}</h2>

      <div class="provider-grid">
        <div data-provider="openai" class="provider-card active">
          <div class="provider-checkmark">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          </div>
          <div class="provider-icon openai">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
            </svg>
          </div>
          <h4 class="provider-name">${t('apiSettings.openai')}</h4>
          <p class="provider-desc">${t('apiSettings.openaiDesc')}</p>
          <a href="https://platform.openai.com/api-keys" target="_blank" class="provider-link">
            ${t('apiSettings.getApiKey')}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>

        <div data-provider="claude" class="provider-card">
          <div class="provider-checkmark">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          </div>
          <div class="provider-icon claude">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="1.5"/>
              <path d="M12 2L13.5 6.5L12 8L10.5 6.5z"/>
              <path d="M12 22L10.5 17.5L12 16L13.5 17.5z"/>
              <path d="M2 12L6.5 10.5L8 12L6.5 13.5z"/>
              <path d="M22 12L17.5 13.5L16 12L17.5 10.5z"/>
            </svg>
          </div>
          <h4 class="provider-name">${t('apiSettings.claude')}</h4>
          <p class="provider-desc">${t('apiSettings.claudeDesc')}</p>
          <a href="https://console.anthropic.com/settings/keys" target="_blank" class="provider-link">
            ${t('apiSettings.getApiKey')}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>

        <div data-provider="zhipu" class="provider-card">
          <div class="provider-checkmark">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          </div>
          <div class="provider-icon zhipu">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4c-1.5 0-2.8.5-3.8 1.3-.3.2-.3.6 0 .8l2.5 1.8c.2.1.5.1.7 0 .5-.3 1-.5 1.6-.5 1.7 0 3 1.3 3 3 0 .6-.2 1.1-.5 1.6-.1.2-.1.5 0 .7l1.8 2.5c.2.3.6.3.8 0C19.5 14.8 20 13.5 20 12c0-4.4-3.6-8-8-8z"/>
              <circle cx="12" cy="13" r="1.5"/>
            </svg>
          </div>
          <h4 class="provider-name">${t('apiSettings.zhipu')}</h4>
          <p class="provider-desc">${t('apiSettings.zhipuDesc')}</p>
          <a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" class="provider-link">
            ${t('apiSettings.getApiKey')}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="api-config-form">
        <label class="form-label">${t('apiSettings.apiKeyLabel')}</label>
        <div class="input-group">
          <input type="password" id="apiKeyInput" class="api-key-input" placeholder="${t('apiSettings.apiKeyPlaceholder')}">
          <button id="btnToggleKey" class="btn-toggle-key">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
        </div>

        <div class="form-actions">
          <button id="btnSaveConfig" class="btn-primary-large">
            <span id="btnSaveText">${t('apiSettings.saveAndConnect')}</span>
          </button>
          <button id="btnTestConfig" class="btn-secondary-large">
            <span id="btnTestText">${t('apiSettings.testConnection')}</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function initApiSettings() {
  let selectedProvider = 'openai';

  const apiConfig = JSON.parse(localStorage.getItem('apiConfig') || '{}');
  if (apiConfig.provider && apiConfig.apiKey) {
    selectedProvider = apiConfig.provider;
    const input = document.getElementById('apiKeyInput');
    if (input) input.value = apiConfig.apiKey;
    selectProvider(selectedProvider);
  }

  document.querySelectorAll('.provider-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      selectedProvider = card.dataset.provider;
      selectProvider(selectedProvider);
    });
  });

  function selectProvider(provider) {
    document.querySelectorAll('.provider-card').forEach(card => {
      card.classList.toggle('active', card.dataset.provider === provider);
    });
  }

  const btnToggle = document.getElementById('btnToggleKey');
  const apiKeyInput = document.getElementById('apiKeyInput');
  if (btnToggle && apiKeyInput) {
    btnToggle.onclick = () => {
      apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
    };
  }

  const btnTest = document.getElementById('btnTestConfig');
  if (btnTest) {
    btnTest.onclick = async () => {
      const key = apiKeyInput?.value.trim();
      if (!key) {
        alert(t('apiSettings.apiKeyPlaceholder'));
        return;
      }

      const btnText = document.getElementById('btnTestText');
      if (btnText) btnText.textContent = t('apiSettings.testing');
      btnTest.disabled = true;

      try {
        const response = await fetch(`${API_BASE}/api/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: selectedProvider, apiKey: key })
        });
        const data = await response.json();
        if (data.success) {
          if (btnText) btnText.textContent = t('apiSettings.testSuccess');
        } else {
          if (btnText) btnText.textContent = '连接失败';
        }
      } catch (error) {
        console.error('Test connection error:', error);
        if (btnText) btnText.textContent = '连接失败';
      }

      setTimeout(() => {
        if (btnText) btnText.textContent = t('apiSettings.testConnection');
        btnTest.disabled = false;
      }, 2000);
    };
  }

  const btnSave = document.getElementById('btnSaveConfig');
  if (btnSave) {
    btnSave.onclick = async () => {
      const key = apiKeyInput?.value.trim();
      if (!key) {
        alert(t('apiSettings.apiKeyPlaceholder'));
        return;
      }

      const btnText = document.getElementById('btnSaveText');
      if (btnText) btnText.textContent = t('apiSettings.saving');
      btnSave.disabled = true;

      const configData = {
        provider: selectedProvider,
        apiKey: key,
        connectedAt: new Date().toISOString()
      };

      localStorage.setItem('apiConfig', JSON.stringify(configData));

      try {
        const response = await fetch(`${API_BASE}/api/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: selectedProvider, apiKey: key })
        });
        const data = await response.json();
        if (data.success) {
          btnSave.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          if (btnText) btnText.textContent = t('apiSettings.saveSuccess');
        } else {
          btnSave.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
          if (btnText) btnText.textContent = '同步失败';
        }
      } catch (error) {
        console.error('Save config to backend error:', error);
        btnSave.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        if (btnText) btnText.textContent = '本地已保存';
      }

      setTimeout(() => {
        btnSave.style.background = '';
        if (btnText) btnText.textContent = t('apiSettings.saveAndConnect');
        btnSave.disabled = false;
      }, 2000);
    };
  }
}
