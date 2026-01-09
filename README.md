# Ollama API Demo

本项目演示了如何使用 Python 和 JavaScript (Node.js) 调用 Ollama API 与本地 LLM 模型（如 qwen3:8b）进行交互。

项目已拆分为两个独立的子项目：

- **JavaScript/Node.js 示例**: 位于 `js-demo/` 目录
- **Python 示例**: 位于 `python-demo/` 目录

请进入相应的目录查看具体的安装和使用说明。

## 目录结构

```
ollama-api-demo/
├── js-demo/           # JavaScript/Node.js 示例代码及依赖
│   ├── README.md      # JS 项目说明文档
│   ├── package.json   # JS 依赖配置
│   └── ...
├── python-demo/       # Python 示例代码及依赖
│   ├── README.md      # Python 项目说明文档
│   ├── requirements.txt # Python 依赖配置
│   └── ...
└── README.md          # 项目总说明
```

## 快速开始

### JavaScript Demo

```bash
cd js-demo
npm install
node ollama_client.js
```

### Python Demo

```bash
cd python-demo
pip install -r requirements.txt
python ollama_client.py
```
