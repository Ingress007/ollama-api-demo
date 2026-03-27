import requests
import json

def chat_with_qwen3_stream(prompt, model="qwen3:8b"):
    """
    使用REST API与Ollama的qwen3:8b模型进行流式交互
    """
    # Ollama API端点
    url = "http://localhost:11434/api/generate"
    
    # 请求数据
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True  # 设置为True以启用流式输出
    }
    
    # 发送POST请求并流式处理响应
    with requests.post(url, json=payload, stream=True) as response:
        # 检查响应状态
        if response.status_code == 200:
            # 流式读取响应内容
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    try:
                        json_data = json.loads(decoded_line)
                        # 输出模型生成的文本片段
                        if 'response' in json_data:
                            print(json_data['response'], end='', flush=True)
                    except json.JSONDecodeError:
                        pass
        else:
            print(f"Error: {response.status_code} - {response.text}")

def chat_with_qwen3(prompt, model="qwen3:8b"):
    """
    使用REST API与Ollama的qwen3:8b模型进行交互（非流式）
    """
    # Ollama API端点
    url = "http://localhost:11434/api/generate"
    
    # 请求数据
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False  # 设置为False以获得完整响应
    }
    
    # 发送POST请求
    response = requests.post(url, json=payload)
    
    # 检查响应状态
    if response.status_code == 200:
        data = response.json()
        return data.get("response", "")
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

if __name__ == "__main__":
    # 示例：向模型提问（流式输出）
    question = "请写一首关于春天的诗，要求至少4行。"
    print(f"问题: {question}")
    print("回答: ", end='')
    
    chat_with_qwen3_stream(question)
    
    # print("\n\n---另一个示例（非流式）---")
    # question = "请写一首关于春天的诗，要求至少4行。"
    # print(f"问题: {question}")
    
    # answer = chat_with_qwen3(question)
    # if answer:
    #     print(f"回答: {answer}")