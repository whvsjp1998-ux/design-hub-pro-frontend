# Design Hub Pro - Clerk 登录集成

这是一个基于 Vite + Clerk 的现代化 Web 应用，集成了完整的用户认证系统。

## 项目结构

```
clerk-web-hub/
├── src/
│   ├── main.js          # Clerk 初始化和主逻辑
│   └── style.css        # 样式文件
├── index.html           # 主页面
├── .env                 # 环境变量（包含 Clerk API 密钥）
└── package.json         # 项目依赖
```

## 快速开始

### 1. 安装依赖
```bash
cd clerk-web-hub
npm install
```

### 2. 配置 Clerk API 密钥
`.env` 文件已经包含了你的 Clerk 可发布密钥：
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y29tcG9zZWQtY2l2ZXQtNTEuY2xlcmsuYWNjb3VudHMuZGV2JA
```

### 3. 运行开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 4. 构建生产版本
```bash
npm run build
```

构建后的文件在 `dist/` 目录中，可以部署到任何静态托管服务（Vercel、Netlify、GitHub Pages 等）。

## 功能特性

✅ **用户认证**
- 登录/注册表单（由 Clerk 提供）
- 用户会话管理
- 用户资料按钮

✅ **现代化技术栈**
- Vite 构建工具（快速热更新）
- ES6+ JavaScript
- 响应式设计

## 下一步

### 集成原有的 Design Hub Pro 功能
你可以将原来 `index.html` 中的功能迁移到这个新项目：

1. 复制 `i18n.js` 到 `src/` 目录
2. 在 `main.js` 中导入并使用
3. 添加 Dashboard、Projects、API Settings 等页面组件

### 添加订阅功能
Clerk 支持集成 Stripe 等支付系统，可以实现：
- 订阅计划管理
- 支付处理
- 用户权限控制

### 部署到生产环境
推荐使用以下平台：
- **Vercel**：零配置部署，自动 HTTPS
- **Netlify**：简单易用，支持表单和函数
- **Cloudflare Pages**：全球 CDN，速度快

## 技术支持

- Clerk 文档：https://clerk.com/docs
- Vite 文档：https://vitejs.dev
- 问题反馈：在项目中创建 issue
