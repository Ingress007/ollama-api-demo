import os
from ollama import Client

# 获取 API Key 并检查
api_key = os.environ.get('OLLAMA_API_KEY')
if not api_key:
    raise ValueError("请设置 OLLAMA_API_KEY 环境变量")

client = Client(
    host="https://ollama.com",
    headers={'Authorization': 'Bearer ' + api_key}
)

messages = [
  {
    'role': 'user',
    'content': '天空为啥是蓝色的?',
  },
]

for part in client.chat('gpt-oss:120b', messages=messages, stream=True):
  print(part['message']['content'], end='', flush=True)