// 多语言配置文件
const translations = {
    'zh-CN': {
        // Header
        'app.title': 'Design Hub Pro',
        'nav.dashboard': '仪表板',
        'nav.assets': '素材库',
        'nav.projects': '项目',
        'nav.apiSettings': 'API 设置',
        'search.placeholder': '搜索素材...',

        // Dashboard
        'dashboard.addImage': '请添加图片开始识别',
        'dashboard.batchProgress': '批处理进度',
        'dashboard.btnPrevious': '上一张',
        'dashboard.btnNext': '下一张',
        'dashboard.btnAddImages': '添加图片',
        'dashboard.btnBatchProcess': '开启批量识别',
        'dashboard.btnProcessing': '识别中...',
        'dashboard.statusText': 'BATCH PROCESSING ENGINE V2.4',

        // Recognition Mode
        'mode.title': '识别模式选择',
        'mode.text': '图像标题生成',
        'mode.image': '插图细节提取',
        'mode.custom': '自定义描述词',
        'mode.customPlaceholder': '输入自定义描述 (如: 提取人名)',

        // Results
        'result.title': '当前描述输出',
        'result.waiting': '等待识别...',
        'result.analyzing': '分析中...',
        'result.btnAnalyze': '单张识别',
        'result.btnApply': '应用结果',

        // History
        'history.title': '历史生成记录',
        'history.clear': '清空历史',
        'history.empty': '暂无历史记录',
        'history.deleteConfirm': '确定要删除这条历史记录吗？',
        'history.clearConfirm': '确定要清空所有历史记录吗？此操作不可恢复。',

        // Status
        'status.storage': '存储空间',
        'status.service': '服务状态',
        'status.connected': '已连接',
        'status.disconnected': '未连接',

        // Assets Page
        'assets.title': '素材库',
        'assets.subtitle': '管理您生成的 AI 素材',
        'assets.sortByDate': '按日期排序',
        'assets.all': '全部',
        'assets.filterTitle': '标题',
        'assets.details': '详情',
        'assets.custom': '自定义',
        'assets.upload': '上传素材',
        'assets.loadMore': '加载更多素材',
        'assets.showing': '显示 {current} / {total} 个素材',

        // API Settings
        'api.title': 'API 配置',
        'api.subtitle': '管理您的 AI 模型集成，选择服务商并配置密钥，以开启 Design Hub Pro 的高级设辅助功能。',
        'api.providerTitle': '服务商选择',
        'api.keyTitle': 'API 密钥',
        'api.keyPlaceholder': '输入 API Key...',
        'api.keyNote': '您的密钥被加密存储在本地，以用于 API 调用验证。',
        'api.btnSave': '保存并连接',
        'api.btnTest': '测试连接',
        'api.statusConnected': '系统状态: 已连接',
        'api.statusDisconnected': '系统状态: 未连接',
        'api.selectProvider': '请选择一个服务商',
        'api.enterKey': '请输入 API Key',
        'api.saveSuccess': 'API 配置已保存并连接成功！',
        'api.testingConnection': '正在测试 {provider} 连接...\n\n连接测试成功！',

        // Projects Page
        'projects.title': '处理记录',
        'projects.subtitle': '查看和管理您的图像识别结果',
        'projects.tablePreview': '预览',
        'projects.tableOriginal': '原始文件名',
        'projects.tableProgress': '进度',
        'projects.tableNewName': '新文件名',
        'projects.tableActions': '操作',
        'projects.btnSave': '保存',
        'projects.emptyState': '暂无处理记录。前往仪表板开始识别图片。',
        'projects.saveSuccess': '文件已保存为: {filename}',
        'projects.waitingRecognition': '等待识别...',

        // Alerts
        'alert.batchComplete': '批量识别完成！',
        'alert.downloaded': '已下载重命名文件: {filename}',
    },
    'en': {
        // Header
        'app.title': 'Design Hub Pro',
        'nav.dashboard': 'Dashboard',
        'nav.assets': 'Assets',
        'nav.projects': 'Projects',
        'nav.apiSettings': 'API Settings',
        'search.placeholder': 'Search assets...',

        // Dashboard
        'dashboard.addImage': 'Add images to start recognition',
        'dashboard.batchProgress': 'Batch Progress',
        'dashboard.btnPrevious': 'Previous',
        'dashboard.btnNext': 'Next',
        'dashboard.btnAddImages': 'Add Images',
        'dashboard.btnBatchProcess': 'Start Batch Recognition',
        'dashboard.btnProcessing': 'Processing...',
        'dashboard.statusText': 'BATCH PROCESSING ENGINE V2.4',

        // Recognition Mode
        'mode.title': 'Recognition Mode',
        'mode.text': 'Image Title Generation',
        'mode.image': 'Illustration Detail Extraction',
        'mode.custom': 'Custom Description',
        'mode.customPlaceholder': 'Enter custom description (e.g., Extract names)',

        // Results
        'result.title': 'Current Output',
        'result.waiting': 'Waiting for recognition...',
        'result.analyzing': 'Analyzing...',
        'result.btnAnalyze': 'Analyze Single',
        'result.btnApply': 'Apply Result',

        // History
        'history.title': 'Generation History',
        'history.clear': 'Clear History',
        'history.empty': 'No history records',
        'history.deleteConfirm': 'Are you sure you want to delete this record?',
        'history.clearConfirm': 'Are you sure you want to clear all history? This action cannot be undone.',

        // Status
        'status.storage': 'Storage',
        'status.service': 'Service Status',
        'status.connected': 'Connected',
        'status.disconnected': 'Disconnected',

        // Assets Page
        'assets.title': 'Assets Library',
        'assets.subtitle': 'Manage your generated AI materials',
        'assets.sortByDate': 'Sort by Date',
        'assets.all': 'All',
        'assets.filterTitle': 'Title',
        'assets.details': 'Details',
        'assets.custom': 'Custom',
        'assets.upload': 'Upload Asset',
        'assets.loadMore': 'Load More Assets',
        'assets.showing': 'Showing {current} of {total} assets',

        // API Settings
        'api.title': 'API Configuration',
        'api.subtitle': 'Manage your AI model integrations, select providers and configure keys to enable advanced features of Design Hub Pro.',
        'api.providerTitle': 'Provider Selection',
        'api.keyTitle': 'API Key',
        'api.keyPlaceholder': 'Enter API Key...',
        'api.keyNote': 'Your key is encrypted and stored locally for API authentication.',
        'api.btnSave': 'Save & Connect',
        'api.btnTest': 'Test Connection',
        'api.statusConnected': 'SYSTEM STATUS: CONNECTED',
        'api.statusDisconnected': 'SYSTEM STATUS: DISCONNECTED',
        'api.selectProvider': 'Please select a provider',
        'api.enterKey': 'Please enter API Key',
        'api.saveSuccess': 'API configuration saved and connected successfully!',
        'api.testingConnection': 'Testing {provider} connection...\n\nConnection test successful!',

        // Projects Page
        'projects.title': 'Processing Records',
        'projects.subtitle': 'View and manage your image recognition results',
        'projects.tablePreview': 'Preview',
        'projects.tableOriginal': 'Original Name',
        'projects.tableProgress': 'Progress',
        'projects.tableNewName': 'New Name',
        'projects.tableActions': 'Actions',
        'projects.btnSave': 'Save',
        'projects.emptyState': 'No processing records yet. Go to Dashboard to start recognizing images.',
        'projects.saveSuccess': 'File saved as: {filename}',
        'projects.waitingRecognition': 'Waiting for recognition...',

        // Alerts
        'alert.batchComplete': 'Batch recognition completed!',
        'alert.downloaded': 'Downloaded renamed file: {filename}',
    },
    'ja': {
        // Header
        'app.title': 'Design Hub Pro',
        'nav.dashboard': 'ダッシュボード',
        'nav.assets': 'アセット',
        'nav.projects': 'プロジェクト',
        'nav.apiSettings': 'API設定',
        'search.placeholder': 'アセットを検索...',

        // Dashboard
        'dashboard.addImage': '画像を追加して認識を開始',
        'dashboard.batchProgress': 'バッチ進行状況',
        'dashboard.btnPrevious': '前へ',
        'dashboard.btnNext': '次へ',
        'dashboard.btnAddImages': '画像を追加',
        'dashboard.btnBatchProcess': 'バッチ認識を開始',
        'dashboard.btnProcessing': '処理中...',
        'dashboard.statusText': 'BATCH PROCESSING ENGINE V2.4',

        // Recognition Mode
        'mode.title': '認識モード',
        'mode.text': '画像タイトル生成',
        'mode.image': 'イラスト詳細抽出',
        'mode.custom': 'カスタム説明',
        'mode.customPlaceholder': 'カスタム説明を入力（例：名前を抽出）',

        // Results
        'result.title': '現在の出力',
        'result.waiting': '認識待ち...',
        'result.analyzing': '分析中...',
        'result.btnAnalyze': '単一分析',
        'result.btnApply': '結果を適用',

        // History
        'history.title': '生成履歴',
        'history.clear': '履歴をクリア',
        'history.empty': '履歴レコードなし',
        'history.deleteConfirm': 'このレコードを削除してもよろしいですか？',
        'history.clearConfirm': 'すべての履歴をクリアしてもよろしいですか？この操作は元に戻せません。',

        // Status
        'status.storage': 'ストレージ',
        'status.service': 'サービス状態',
        'status.connected': '接続済み',
        'status.disconnected': '未接続',

        // Assets Page
        'assets.title': 'アセットライブラリ',
        'assets.subtitle': '生成されたAI素材を管理',
        'assets.sortByDate': '日付で並べ替え',
        'assets.all': 'すべて',
        'assets.filterTitle': 'タイトル',
        'assets.details': '詳細',
        'assets.custom': 'カスタム',
        'assets.upload': 'アセットをアップロード',
        'assets.loadMore': 'さらに読み込む',
        'assets.showing': '{total}件中{current}件を表示',

        // API Settings
        'api.title': 'API設定',
        'api.subtitle': 'AIモデル統合を管理し、プロバイダーを選択してキーを設定し、Design Hub Proの高度な機能を有効にします。',
        'api.providerTitle': 'プロバイダー選択',
        'api.keyTitle': 'APIキー',
        'api.keyPlaceholder': 'APIキーを入力...',
        'api.keyNote': 'キーは暗号化されてローカルに保存され、API認証に使用されます。',
        'api.btnSave': '保存して接続',
        'api.btnTest': '接続をテスト',
        'api.statusConnected': 'システム状態: 接続済み',
        'api.statusDisconnected': 'システム状態: 未接続',
        'api.selectProvider': 'プロバイダーを選択してください',
        'api.enterKey': 'APIキーを入力してください',
        'api.saveSuccess': 'API設定が保存され、正常に接続されました！',
        'api.testingConnection': '{provider}接続をテスト中...\n\n接続テスト成功！',

        // Projects Page
        'projects.title': '処理記録',
        'projects.subtitle': '画像認識結果を表示および管理',
        'projects.tablePreview': 'プレビュー',
        'projects.tableOriginal': '元のファイル名',
        'projects.tableProgress': '進行状況',
        'projects.tableNewName': '新しいファイル名',
        'projects.tableActions': '操作',
        'projects.btnSave': '保存',
        'projects.emptyState': '処理記録がありません。ダッシュボードに移動して画像認識を開始してください。',
        'projects.saveSuccess': 'ファイルを保存しました: {filename}',
        'projects.waitingRecognition': '認識待ち...',

        // Alerts
        'alert.batchComplete': 'バッチ認識が完了しました！',
        'alert.downloaded': 'リネームされたファイルをダウンロードしました: {filename}',
    }
};

// 国际化工具类
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = translations;
    }

    // 获取当前语言
    getCurrentLang() {
        return this.currentLang;
    }

    // 设置语言
    setLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updatePageTexts();
        }
    }

    // 获取翻译文本
    t(key, params = {}) {
        let text = this.translations[this.currentLang]?.[key] || key;

        // 替换参数
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    }

    // 更新页面所有文本
    updatePageTexts() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const paramsAttr = element.getAttribute('data-i18n-params');
            const params = paramsAttr ? JSON.parse(paramsAttr) : {};

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = this.t(key, params);
            } else {
                element.textContent = this.t(key, params);
            }
        });

        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLang;

        // 触发自定义事件，通知页面语言已更改
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    }

    // 获取所有可用语言
    getAvailableLanguages() {
        return [
            { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'ja', name: '日本語', flag: '🇯🇵' }
        ];
    }
}

// 创建全局实例
const i18n = new I18n();
