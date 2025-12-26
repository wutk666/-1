# 圣诞树 API 服务器使用说明

## 📋 概述

由于浏览器的 CORS（跨域资源共享）限制，无法直接从前端调用 SiliconFlow API。
因此创建了一个本地 Node.js 代理服务器来转发 API 请求。

## 🚀 快速开始

### 1. 安装依赖

在 `christmas` 目录下运行：

```bash
npm install
```

这会安装以下依赖：
- `express` - Web 服务器框架
- `cors` - 跨域支持
- `node-fetch` - HTTP 请求库

### 2. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### 3. 打开网页

在浏览器中打开 `c-1.html`，确保：
- API 服务器正在运行
- `c-1.html` 中的 `USE_LOCAL_PROXY` 设置为 `true`（默认已设置）

## 🔧 配置

### 修改 API Key

在 `api-server.js` 中修改：

```javascript
const API_KEY = 'your-api-key-here';
```

或者在网页中点击 "⚙️ API设置" 按钮输入新的 Key。

### 修改模型

在 `api-server.js` 中的请求体中修改 `model` 字段：

```javascript
model: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'
```

### 切换直接调用模式

如果您的环境支持直接调用（无 CORS 限制），可以在 `c-1.html` 中设置：

```javascript
const USE_LOCAL_PROXY = false;
```

## 📡 API 端点

### GET /health
健康检查端点

**响应示例：**
```json
{
  "status": "ok",
  "message": "Christmas Tree API Server is running",
  "timestamp": "2024-12-26T08:00:00.000Z"
}
```

### POST /api/generate-wish-simple
生成圣诞祝福（非流式）

**请求体：**
```json
{
  "topic": "朋友"
}
```

**响应示例：**
```json
{
  "content": "在这璀璨的圣诞夜，愿我们的友谊如同圣诞树上最闪耀的星星...",
  "model": "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B"
}
```

### POST /api/generate-wish
生成圣诞祝福（流式，Server-Sent Events）

**请求体：**
```json
{
  "topic": "家人"
}
```

**响应：** 流式文本（SSE 格式）

## 🐛 故障排除

### 问题：服务器无法启动

**解决方案：**
1. 确保已安装 Node.js (v14+)
2. 运行 `npm install` 安装依赖
3. 检查端口 3000 是否被占用

### 问题：网页显示"祝福生成失败"

**解决方案：**
1. 确认 API 服务器正在运行（访问 http://localhost:3000/health）
2. 检查浏览器控制台的错误信息
3. 验证 API Key 是否有效

### 问题：仍然显示本地备用祝福

**原因：**
- API 调用失败时会自动回退到本地祝福库
- 检查控制台日志查看具体错误

## 📝 文件说明

- `api-server.js` - Node.js 代理服务器
- `package.json` - 项目依赖配置
- `c-1.html` - 前端页面（已配置使用本地代理）
- `README-API.md` - 本文档

## 🎄 享受您的圣诞树体验！

