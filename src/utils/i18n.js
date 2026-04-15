// 多语言配置
export const translations = {
  'zh-CN': {
    // 导航栏
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      apiSettings: 'API Settings'
    },
    // Dashboard 页面
    dashboard: {
      serviceStatus: '服务状态',
      connected: '已连接',
      disconnected: '未连接',
      dropZoneHint: '拖入或点击下方按钮添加待识别素材',
      addImages: '添加图片',
      startBatch: '开启批量识别',
      processing: '处理中...',
      batchProcessing: '批量处理中',
      recognitionMode: '识别模式',
      imageTitle: '图像标题生成',
      imageDetail: '插图细节提取',
      customPrompt: '自定义描述词',
      customPromptPlaceholder: '输入自定义提取要求...',
      currentOutput: '当前描述输出',
      waitingData: '等待数据...',
      analyzeSingle: '单张识别',
      analyzing: '分析中...',
      applyResult: '应用结果',
      historyTitle: '自定义描述词历史记录',
      clearHistory: '清空'
    },
    // Projects 页面
    projects: {
      title: 'Processing Records',
      subtitle: '实时同步 Dashboard 的处理进度',
      clearRecords: '清空历史',
      preview: '预览',
      originalName: '原始名称',
      status: '状态',
      result: '识别结果',
      actions: '操作',
      save: '保存',
      emptyState: '暂无处理记录',
      statusDone: 'DONE',
      statusProcessing: 'PROC'
    },
    // API Settings 页面
    apiSettings: {
      title: 'API 配置',
      openai: 'OpenAI',
      openaiDesc: 'GPT-4o & DALL·E 3',
      claude: 'Claude',
      claudeDesc: 'Anthropic Sonnet',
      zhipu: '智谱AI',
      zhipuDesc: 'ChatGLM Vision',
      getApiKey: '获取 API 密钥',
      apiKeyLabel: 'API Secret Key',
      apiKeyPlaceholder: 'sk-...',
      saveAndConnect: '保存并连接 (Save)',
      testConnection: '测试连接',
      testing: '测试中...',
      saving: '保存中...',
      testSuccess: '连接成功 ✓',
      saveSuccess: '配置已生效 ✓'
    }
  },
  'en': {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      apiSettings: 'API Settings'
    },
    // Dashboard page
    dashboard: {
      serviceStatus: 'Service Status',
      connected: 'Connected',
      disconnected: 'Disconnected',
      dropZoneHint: 'Drop images here or click button below',
      addImages: 'Add Images',
      startBatch: 'Start Batch Processing',
      processing: 'Processing...',
      batchProcessing: 'Batch Processing',
      recognitionMode: 'Recognition Mode',
      imageTitle: 'Image Title Generation',
      imageDetail: 'Illustration Detail Extraction',
      customPrompt: 'Custom Prompt',
      customPromptPlaceholder: 'Enter custom extraction requirements...',
      currentOutput: 'Current Output',
      waitingData: 'Waiting for data...',
      analyzeSingle: 'Analyze Single',
      analyzing: 'Analyzing...',
      applyResult: 'Apply Result',
      historyTitle: 'Custom Prompt History',
      clearHistory: 'Clear'
    },
    // Projects page
    projects: {
      title: 'Processing Records',
      subtitle: 'Real-time sync with Dashboard processing',
      clearRecords: 'Clear History',
      preview: 'Preview',
      originalName: 'Original Name',
      status: 'Status',
      result: 'Recognition Result',
      actions: 'Actions',
      save: 'Save',
      emptyState: 'No processing records',
      statusDone: 'DONE',
      statusProcessing: 'PROC'
    },
    // API Settings page
    apiSettings: {
      title: 'API Configuration',
      openai: 'OpenAI',
      openaiDesc: 'GPT-4o & DALL·E 3',
      claude: 'Claude',
      claudeDesc: 'Anthropic Sonnet',
      zhipu: 'Zhipu AI',
      zhipuDesc: 'ChatGLM Vision',
      getApiKey: 'Get API Key',
      apiKeyLabel: 'API Secret Key',
      apiKeyPlaceholder: 'sk-...',
      saveAndConnect: 'Save & Connect',
      testConnection: 'Test Connection',
      testing: 'Testing...',
      saving: 'Saving...',
      testSuccess: 'Connected ✓',
      saveSuccess: 'Configuration Saved ✓'
    }
  }
};

// 当前语言
let currentLang = localStorage.getItem('preferredLanguage') || 'en';

// 获取翻译文本
export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

// 设置语言
export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('preferredLanguage', lang);
}

// 获取当前语言
export function getCurrentLanguage() {
  return currentLang;
}
