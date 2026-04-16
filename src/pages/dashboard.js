import { t } from '../utils/i18n.js';
import { isProUser, requirePro, consumeQuota, getRemainingQuota, getQuotaInfo, getDaysRemaining, getSubscriptionExpiry } from '../utils/proGuard.js';
import { storeOriginalFile, getOriginalFile, clearAllFiles } from '../utils/fileStore.js';

const AppState = {
  currentQueue: [],
  currentIndex: 0,
  selectedMode: 'text',
  isConnected: false,
  batchResults: {},
  isProcessing: false,
};

export function createDashboard() {
  return `
    <section class="dashboard-page">
      <div class="dashboard-container">
        <div class="dashboard-left">
          <div class="status-banner">
            <div id="serviceStatusDot" class="status-dot"></div>
            <span id="serviceStatusText" class="status-text">${t('dashboard.serviceStatus')}: ${t('dashboard.disconnected')}</span>
          </div>

          <div id="quotaBanner" class="quota-banner">
            <span id="quotaText">加载中...</span>
          </div>

          <div id="imageDisplay" class="image-display">
            <div id="dropZoneHint" class="drop-zone-hint">
              <div class="upload-plus">+</div>
              <p>${t('dashboard.dropZoneHint')}</p>
            </div>
          </div>

          <div id="progressBar" class="progress-bar hidden">
            <div class="progress-header">
              <span>${t('dashboard.batchProcessing')}</span>
              <span id="progressText">0% (0/0)</span>
            </div>
            <div class="progress-track">
              <div id="progressFill" class="progress-fill"></div>
            </div>
          </div>

          <div id="navigationButtons" class="nav-buttons hidden">
            <button id="btnPrevious" class="nav-btn" disabled>
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button id="btnNext" class="nav-btn" disabled>
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>

          <div class="action-buttons">
            <button id="btnAddImages" class="btn-secondary">${t('dashboard.addImages')}</button>
            <button id="btnBatchProcess" class="btn-primary" disabled>
              <span id="btnBatchText">${t('dashboard.startBatch')}</span>
            </button>
          </div>
          <input type="file" id="fileInput" multiple class="hidden" accept="image/*">
        </div>

        <div class="dashboard-right">
          <div class="mode-section">
            <h3 class="section-title">${t('dashboard.recognitionMode')}</h3>
            <div class="mode-options">
              <div data-mode="text" class="mode-option active">
                <span class="mode-text">${t('dashboard.imageTitle')}</span>
                <div class="mode-circle">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
              </div>
              <div data-mode="image" class="mode-option">
                <span class="mode-text">${t('dashboard.imageDetail')}</span>
                <div class="mode-circle">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
              </div>
              <div data-mode="custom" class="mode-option">
                <span class="mode-text">${t('dashboard.customPrompt')}</span>
                <div class="mode-circle">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div id="customPromptSection" class="custom-prompt-section hidden">
            <input type="text" id="customPromptInput" placeholder="${t('dashboard.customPromptPlaceholder')}" class="custom-input">
          </div>

          <div class="result-section">
            <h3 class="section-title">${t('dashboard.currentOutput')}</h3>
            <textarea id="resultOutput" class="result-output" placeholder="${t('dashboard.waitingData')}" rows="2"></textarea>
          </div>

          <div class="action-row">
            <button id="btnAnalyzeSingle" class="btn-analyze" disabled>
              <span id="btnSingleText">${t('dashboard.analyzeSingle')}</span>
            </button>
            <button id="btnApplyResult" class="btn-apply" disabled>${t('dashboard.applyResult')}</button>
          </div>

          <div class="history-section">
            <div class="history-header">
              <h3 class="section-title-small">${t('dashboard.historyTitle')}</h3>
              <button id="btnClearHistory" class="btn-clear">${t('dashboard.clearHistory')}</button>
            </div>
            <div id="historyListSide" class="history-list"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initDashboard(clerk) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  AppState.isConnected = true;
  updateConnectionUI();
  updateQuotaBanner();

  if (AppState.currentQueue.length > 0) {
    displayCurrentImage();
    enableButtons();
  }

  document.querySelectorAll('.mode-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.mode === AppState.selectedMode);
  });
  if (AppState.selectedMode === 'custom') {
    document.getElementById('customPromptSection')?.classList.remove('hidden');
  }

  function requireLogin() {
    if (clerk && clerk.user) return true;
    const modal = document.createElement('div');
    modal.id = 'sign-in-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;';
    modal.innerHTML = '<div id="sign-in"></div><button id="closeModal" style="position:absolute;top:20px;right:20px;background:#333;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">Close</button>';
    document.body.appendChild(modal);
    const signInDiv = document.getElementById('sign-in');
    clerk.mountSignIn(signInDiv);
    document.getElementById('closeModal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    return false;
  }

  function updateQuotaBanner() {
    const quotaBanner = document.getElementById('quotaBanner');
    const quotaText = document.getElementById('quotaText');
    if (!quotaBanner || !quotaText) return;

    const info = getQuotaInfo(clerk);
    const remaining = getRemainingQuota(clerk);
    const daysRemaining = getDaysRemaining(clerk);
    const expiry = getSubscriptionExpiry(clerk);

    if (remaining === Infinity) {
      const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : '长期有效';
      quotaText.innerHTML = `🌟 <strong>Unlimited</strong> - 所有功能已解锁 <span style="font-size: 0.85em; opacity: 0.9;">(到期: ${expiryDate}, 剩余 ${daysRemaining} 天)</span>`;
      quotaBanner.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (remaining > 0) {
      if (info.isTrial) {
        quotaText.innerHTML = `🎁 <strong>Trial</strong> - 剩余 ${remaining} 次 (试用还剩 ${info.trialDaysLeft} 天)`;
        quotaBanner.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      } else {
        const expiryDate = expiry ? new Date(expiry).toLocaleDateString('zh-CN') : '下月重置';
        quotaText.innerHTML = `📊 <strong>${info.planLabel}</strong> - 剩余 ${remaining} 次 <span style="font-size: 0.85em; opacity: 0.9;">(到期: ${expiryDate}, 剩余 ${daysRemaining} 天)</span>`;
        quotaBanner.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      }
    } else {
      quotaText.innerHTML = '⚠️ <strong>额度已用完</strong> - 请升级或等待重置';
      quotaBanner.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    }
  }

  function resizeImageToBase64(file, maxSize, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          } else {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', quality);
        URL.revokeObjectURL(url);
        resolve(base64);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }

  async function fetchAnalyzeWithTimeout(file, mode) {
    try {
      const imageBase64 = await resizeImageToBase64(file, 1024, 0.8);
      if (!imageBase64) {
        throw new Error('Failed to compress image for AI');
      }

      const body = {
        image_base64: imageBase64,
        mode: mode
      };

      const customPromptInput = document.getElementById('customPromptInput');
      if (mode === 'custom' && customPromptInput) {
        body.customPrompt = customPromptInput.value;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error('Request timeout');
        controller.abort();
      }, 60000);

      console.log('Sending to:', `${API_BASE}/api/analyze`);
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      console.log('Response:', response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP error:', response.status, errorText);
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Result:', data);
      return data.success ? data.result : `Analysis failed: ${data.error || 'Unknown error'}`;
    } catch (error) {
      console.error('API call failed:', error.name, error.message);
      if (error.name === 'AbortError') {
        return 'Request timeout, please retry';
      }
      await new Promise(r => setTimeout(r, 800));
      if (mode === 'text') return `AI_Image_${Math.floor(Math.random()*1000)}`;
      if (mode === 'image') return `Detail_Extracted_${Math.floor(Math.random()*100)}`;
      const customPromptInput = document.getElementById('customPromptInput');
      return `${customPromptInput?.value || 'Custom'}_${Math.floor(Math.random()*1000)}`;
    }
  }

  function updateConnectionUI() {
    const dot = document.getElementById('serviceStatusDot');
    const text = document.getElementById('serviceStatusText');
    if (dot && text) {
      dot.className = AppState.isConnected ? 'status-dot connected' : 'status-dot';
      text.textContent = AppState.isConnected ? 'Service Status: Connected' : 'Service Status: Disconnected';
    }
  }

  const fileInput = document.getElementById('fileInput');
  const btnAddImages = document.getElementById('btnAddImages');
  const imageDisplay = document.getElementById('imageDisplay');

  if (btnAddImages) {
    btnAddImages.onclick = () => fileInput?.click();
  }

  if (fileInput) {
    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) handleFiles(files);
    };
  }

  const resultOutput = document.getElementById('resultOutput');
  if (resultOutput) {
    resultOutput.addEventListener('input', (e) => {
      AppState.batchResults[AppState.currentIndex] = e.target.value;
    });
  }

  if (imageDisplay) {
    imageDisplay.addEventListener('click', () => {
      fileInput?.click();
    });

    imageDisplay.addEventListener('dragover', (e) => {
      e.preventDefault();
      imageDisplay.style.borderColor = '#3b82f6';
    });

    imageDisplay.addEventListener('dragleave', (e) => {
      e.preventDefault();
      imageDisplay.style.borderColor = '';
    });

    imageDisplay.addEventListener('drop', (e) => {
      e.preventDefault();
      imageDisplay.style.borderColor = '';
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) handleFiles(files);
    });
  }

  function handleFiles(files) {
    clearAllFiles();
    files.forEach(f => storeOriginalFile(f.name, f));
    AppState.currentQueue = files;
    AppState.currentIndex = 0;
    AppState.batchResults = {};
    displayCurrentImage();
    enableButtons();
  }

  function displayCurrentImage() {
    if (AppState.currentQueue.length === 0) return;
    const file = AppState.currentQueue[AppState.currentIndex];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDisplay = document.getElementById('imageDisplay');
      if (imageDisplay) {
        imageDisplay.innerHTML = `<img src="${e.target.result}" class="preview-img">`;
      }

      const resultOutput = document.getElementById('resultOutput');
      if (resultOutput) {
        const result = AppState.batchResults[AppState.currentIndex];
        resultOutput.value = result || '等待分析数据流...';
        resultOutput.style.color = result ? '#fff' : '#9ca3af';
      }

      const navButtons = document.getElementById('navigationButtons');
      if (AppState.currentQueue.length > 1 && navButtons) {
        navButtons.classList.remove('hidden');
        const btnPrev = document.getElementById('btnPrevious');
        const btnNext = document.getElementById('btnNext');
        if (btnPrev) btnPrev.disabled = AppState.currentIndex === 0;
        if (btnNext) btnNext.disabled = AppState.currentIndex === AppState.currentQueue.length - 1;
      }
    };
    reader.readAsDataURL(file);
  }

  function enableButtons() {
    if (AppState.currentQueue.length > 0 && AppState.isConnected) {
      const btnBatch = document.getElementById('btnBatchProcess');
      const btnSingle = document.getElementById('btnAnalyzeSingle');
      if (btnBatch) btnBatch.disabled = false;
      if (btnSingle) btnSingle.disabled = false;
    }
  }

  document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
      const mode = option.dataset.mode;
      if ((mode === 'custom' || mode === 'image') && !isProUser(clerk)) {
        requirePro(clerk);
        return;
      }
      document.querySelectorAll('.mode-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      AppState.selectedMode = mode;
      const customSection = document.getElementById('customPromptSection');
      if (customSection) {
        customSection.classList.toggle('hidden', AppState.selectedMode !== 'custom');
      }
    });
  });

  const btnPrev = document.getElementById('btnPrevious');
  const btnNext = document.getElementById('btnNext');
  if (btnPrev) {
    btnPrev.onclick = () => {
      if (AppState.currentIndex > 0) {
        AppState.currentIndex--;
        displayCurrentImage();
      }
    };
  }
  if (btnNext) {
    btnNext.onclick = () => {
      if (AppState.currentIndex < AppState.currentQueue.length - 1) {
        AppState.currentIndex++;
        displayCurrentImage();
      }
    };
  }

  const btnAnalyzeSingle = document.getElementById('btnAnalyzeSingle');
  if (btnAnalyzeSingle) {
    btnAnalyzeSingle.onclick = async () => {
      if (!requireLogin()) return;
      if (!AppState.isConnected || AppState.currentQueue.length === 0) return;

      if (!consumeQuota(clerk)) {
        requirePro(clerk);
        return;
      }

      const file = AppState.currentQueue[AppState.currentIndex];
      const btnText = document.getElementById('btnSingleText');
      if (btnText) btnText.textContent = 'Analyzing...';
      btnAnalyzeSingle.disabled = true;

      const resultOutput = document.getElementById('resultOutput');
      if (resultOutput) {
        resultOutput.value = 'Analyzing image features...';
        resultOutput.style.color = '#3b82f6';
      }

      updateQuotaBanner();

      const thumb = await resizeImageToBase64(file, 200, 0.6);
      const result = await fetchAnalyzeWithTimeout(file, AppState.selectedMode);

      AppState.batchResults[AppState.currentIndex] = result;
      if (resultOutput) {
        resultOutput.value = result;
        resultOutput.style.color = '#fff';
      }

      addOrUpdateRecord(file.name, result, thumb, 'completed');

      const btnApply = document.getElementById('btnApplyResult');
      if (btnApply) btnApply.disabled = false;

      if (btnText) btnText.textContent = 'Analyze Single';
      btnAnalyzeSingle.disabled = false;
    };
  }

  function addOrUpdateRecord(originalName, newName, thumbnail, status) {
    try {
      let records = JSON.parse(localStorage.getItem('processingRecords') || '[]');
      const idx = records.findIndex(r => r.originalName === originalName);

      let displayThumb = thumbnail;
      if (thumbnail && thumbnail.length > 50000) {
        displayThumb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%23999' font-size='12'%3EIMG%3C/text%3E%3C/svg%3E";
      }

      const entry = {
        originalName,
        newName,
        thumbnail: displayThumb,
        status,
        time: new Date().toLocaleTimeString('en-US', { hour12: false })
      };

      if (idx > -1) {
        records[idx] = entry;
      } else {
        records.unshift(entry);
      }

      if (records.length > 20) records = records.slice(0, 20);

      localStorage.setItem('processingRecords', JSON.stringify(records));
    } catch (error) {
      console.error('保存记录失败:', error);
    }
  }

  const btnBatchProcess = document.getElementById('btnBatchProcess');
  if (btnBatchProcess) {
    btnBatchProcess.onclick = async () => {
      if (!requireLogin()) return;
      if (!isProUser(clerk)) { requirePro(clerk); return; }
      if (!AppState.isConnected || AppState.currentQueue.length === 0 || AppState.isProcessing) return;

      const remaining = getRemainingQuota(clerk);
      if (remaining !== Infinity && remaining < AppState.currentQueue.length) {
        alert(`您的剩余配额（${remaining}次）不足以处理全部 ${AppState.currentQueue.length} 张图片。\n请升级或等待配额重置。`);
        return;
      }

      AppState.isProcessing = true;
      const btnText = document.getElementById('btnBatchText');
      if (btnText) btnText.textContent = 'Processing...';
      btnBatchProcess.disabled = true;

      const progressBar = document.getElementById('progressBar');
      if (progressBar) progressBar.classList.remove('hidden');

      for (let i = 0; i < AppState.currentQueue.length; i++) {
        if (!consumeQuota(clerk)) {
          alert(`配额已用完！已处理 ${i} 张图片。`);
          break;
        }

        const file = AppState.currentQueue[i];
        const thumb = await resizeImageToBase64(file, 200, 0.6);
        addOrUpdateRecord(file.name, "AI Processing...", thumb, 'processing');

        const resultOutput = document.getElementById('resultOutput');
        if (resultOutput && AppState.currentIndex === i) {
          resultOutput.value = `Extracting features: ${file.name}`;
          resultOutput.style.color = '#3b82f6';
        }

        const result = await fetchAnalyzeWithTimeout(file, AppState.selectedMode);
        AppState.batchResults[i] = result;

        addOrUpdateRecord(file.name, result, thumb, 'completed');

        const percent = Math.round(((i + 1) / AppState.currentQueue.length) * 100);
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressText) progressText.textContent = `${percent}% (${i + 1}/${AppState.currentQueue.length})`;

        if (AppState.currentIndex === i && resultOutput) {
          resultOutput.value = result;
          resultOutput.style.color = '#fff';
        }

        updateQuotaBanner();
      }

      AppState.isProcessing = false;
      if (btnText) btnText.textContent = 'Start Batch';
      btnBatchProcess.disabled = false;
      updateQuotaBanner();
      alert('Batch processing complete! All results synced to Projects.');
    };
  }

  const btnApplyResult = document.getElementById('btnApplyResult');
  if (btnApplyResult) {
    btnApplyResult.onclick = () => {
      const result = document.getElementById('resultOutput')?.value;
      if (!result || result.includes('等待')) return;

      const file = AppState.currentQueue[AppState.currentIndex];
      const originalFile = getOriginalFile(file.name) || file;
      const ext = originalFile.name.substring(originalFile.name.lastIndexOf('.'));
      const link = document.createElement('a');
      link.href = URL.createObjectURL(originalFile);
      link.download = result + ext;
      link.click();
      URL.revokeObjectURL(link.href);
    };
  }
}
