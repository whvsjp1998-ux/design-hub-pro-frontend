// 导入多语言函数
import { t } from '../utils/i18n.js';

// Projects 页面组件
export function createProjects() {
  return `
    <section class="projects-page">
      <div class="projects-header">
        <div>
          <h2 class="page-title">${t('projects.title')}</h2>
          <p class="page-subtitle">${t('projects.subtitle')}</p>
        </div>
        <button id="btnClearRecords" class="btn-danger-outline">${t('projects.clearRecords')}</button>
      </div>

      <div class="records-table-container">
        <table class="records-table">
          <thead>
            <tr>
              <th class="col-preview">${t('projects.preview')}</th>
              <th>${t('projects.originalName')}</th>
              <th class="col-status">${t('projects.status')}</th>
              <th>${t('projects.result')}</th>
              <th class="col-actions">${t('projects.actions')}</th>
            </tr>
          </thead>
          <tbody id="recordsTableBody">
            <tr>
              <td colspan="5" class="empty-state">${t('projects.emptyState')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

// Projects 功能逻辑
export function initProjects() {
  loadRecordsTable();

  const btnClear = document.getElementById('btnClearRecords');
  if (btnClear) {
    btnClear.onclick = () => {
      if (confirm('确定清空所有本地记录吗？')) {
        localStorage.removeItem('processingRecords');
        loadRecordsTable();
      }
    };
  }
}

function loadRecordsTable() {
  const records = JSON.parse(localStorage.getItem('processingRecords') || '[]');
  const tbody = document.getElementById('recordsTableBody');

  if (!tbody) return;

  if (records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">暂无处理记录</td></tr>';
    return;
  }

  tbody.innerHTML = records.map((r, i) => {
    const isCompleted = r.status === 'completed';
    return `
      <tr class="record-row">
        <td class="col-preview">
          <img src="${r.thumbnail || ''}" class="record-thumbnail ${!isCompleted ? 'processing' : ''}" alt="preview">
        </td>
        <td class="col-name">${r.originalName}</td>
        <td class="col-status">
          <div class="status-indicator">
            <div class="status-bar">
              <div class="status-fill ${isCompleted ? 'completed' : 'processing'}"></div>
            </div>
            <span class="status-label ${isCompleted ? 'completed' : 'processing'}">
              ${isCompleted ? t('projects.statusDone') : t('projects.statusProcessing')}
            </span>
          </div>
        </td>
        <td class="col-result">
          <input
            type="text"
            value="${r.newName || ''}"
            class="result-input ${!isCompleted ? 'disabled' : ''}"
            ${!isCompleted ? 'disabled' : ''}
            onchange="updateRecordName(${i}, this.value)"
          />
        </td>
        <td class="col-actions">
          <button
            onclick="downloadRecord(${i})"
            class="btn-download ${!isCompleted ? 'disabled' : ''}"
            ${!isCompleted ? 'disabled' : ''}
          >
            ${t('projects.save')}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 全局函数供 HTML 调用
window.updateRecordName = function(index, value) {
  const records = JSON.parse(localStorage.getItem('processingRecords') || '[]');
  if (records[index]) {
    records[index].newName = value;
    localStorage.setItem('processingRecords', JSON.stringify(records));
  }
};

window.downloadRecord = function(index) {
  const records = JSON.parse(localStorage.getItem('processingRecords') || '[]');
  const record = records[index];
  if (!record || !record.newName) return;

  const link = document.createElement('a');
  link.href = record.thumbnail;
  link.download = record.newName + record.originalName.substring(record.originalName.lastIndexOf('.'));
  link.click();
};
