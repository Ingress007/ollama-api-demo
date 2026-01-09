# Ollama JavaScript/Node.js Demo

这个目录包含了使用 JavaScript (Node.js) 与 Ollama API 交互的示例代码。

## 前置条件

1. 系统中已安装 Ollama
2. 已拉取 qwen3:8b 模型 (`ollama pull qwen3:8b`)
3. 已安装 Node.js

## 安装依赖

在 `js-demo` 目录下运行：

```bash
npm install
```

## 使用方法

### 1. 使用 Ollama 官方 JS 客户端库

`ollama_client.js` 演示了如何使用官方的 `ollama` npm 包进行交互（支持流式和非流式）。

```bash
node ollama_client.js
```

### 2. 使用原生 REST API (fetch)

`ollama_rest_api.js` 演示了如何不依赖 SDK，直接通过 HTTP 请求与 Ollama API 交互。

```bash
node ollama_rest_api.js
```

## 流式输出 vs 非流式输出

### 流式输出 (Stream)
- **优势**: 实时显示模型生成的内容，用户体验更好；无需等待完整响应，减少感知延迟。
- **适用场景**: 聊天机器人、长文本生成。

### 非流式输出 (Non-Stream)
- **优势**: 更容易处理完整的响应内容；便于后续处理和分析；错误处理更简单。
- **适用场景**: 文本分析、总结、不需要实时展示的后台任务。

## 常见问题

1. **连接被拒绝 (Connection Refused)**
   - 确保 Ollama 服务正在运行。
   - 默认监听地址为 `localhost:11434`。

2. **模型未找到 (Model Not Found)**
   - 确保已使用 `ollama pull qwen3:8b` 下载模型。
   - 可以在代码中修改 `model` 变量来使用其他已下载的模型。

3. **响应缓慢**
   - 大模型在纯 CPU 环境下运行可能较慢。
   - 建议使用支持 CUDA 的 GPU 加速，或尝试更小的模型（如 `qwen:0.5b`）。
