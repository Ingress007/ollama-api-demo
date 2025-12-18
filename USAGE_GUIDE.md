# Ollama API使用指南

## 启动Ollama服务

在使用这些示例代码之前，请确保：

1. 已经安装了Ollama
2. qwen3:8b模型已经下载到本地

可以通过以下命令下载模型：
```bash
ollama pull qwen3:8b
```

启动Ollama服务（通常安装后会自动启动）：
```bash
ollama serve
```

## Python示例说明

提供了两种Python实现方式：

### 1. 使用REST API (ollama_rest_api.py)

直接使用HTTP请求调用Ollama API，不依赖特定客户端库。

关键参数：
- `model`: 指定要使用的模型名称 (qwen3:8b)
- `prompt`: 输入给模型的提示词
- `stream`: 是否流式输出 (True为流式输出，False为一次性获取完整响应)

### 2. 使用Ollama Python客户端 (ollama_client.py)

使用官方的Ollama Python客户端库，提供了更简洁的API接口。

## JavaScript示例说明

### Node.js实现 (ollama_js_example.js)

使用Node.js的fetch API直接调用Ollama REST端点，支持流式和非流式两种模式。

## 流式输出 vs 非流式输出

### 流式输出的优势：
1. 实时显示模型生成的内容，用户体验更好
2. 无需等待完整响应，减少感知延迟
3. 适用于长文本生成场景

### 非流式输出的优势：
1. 更容易处理完整的响应内容
2. 便于后续处理和分析
3. 错误处理更简单

## 常见问题

1. **连接被拒绝错误**: 确保Ollama服务正在运行，默认监听在`localhost:11434`
2. **模型未找到错误**: 确保已使用`ollama pull qwen3:8b`下载模型
3. **响应缓慢**: qwen3:8b是80亿参数的大模型，在CPU上运行可能较慢，建议使用支持CUDA的GPU加速

## API端点说明

- 聊天接口: `POST http://localhost:11434/api/generate`
- 模型列表: `GET http://localhost:11434/api/tags`
- 模型详情: `GET http://localhost:11434/api/show`

更多详细信息请参考[Ollama官方文档](https://github.com/ollama/ollama/blob/main/docs/api.md)