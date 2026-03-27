from ollama import Client

# 使用Ollama Python客户端进行交互
def chat_with_qwen3_client_stream(prompt, model="qwen3:8b"):
    """
    使用Ollama Python客户端与qwen3:8b模型进行流式交互
    """
    # 创建Ollama客户端
    client = Client(host='http://localhost:11434')
    
    # 发送聊天请求并流式处理响应
    stream = client.chat(
        model=model,
        messages=[
            {
                'role': 'user',
                'content': prompt,
            }
        ],
        stream=True  # 启用流式输出
    )
    
    # 流式输出模型的回复
    for chunk in stream:
        print(chunk['message']['content'], end='', flush=True)

# 使用Ollama Python客户端进行交互（非流式）
def chat_with_qwen3_client(prompt, model="qwen3:8b"):
    """
    使用Ollama Python客户端与qwen3:8b模型进行交互（非流式）
    """
    # 创建Ollama客户端
    client = Client(host='http://localhost:11434')
    
    # 发送聊天请求
    response = client.chat(
        model=model,
        messages=[
            {
                'role': 'user',
                'content': prompt,
            }
        ]
    )
    
    # 返回模型的回复
    return response['message']['content']

if __name__ == "__main__":
    # 示例：向模型提问（流式输出）
    question = "请解释量子计算的基本原理，至少包含3个要点。"
    print(f"问题: {question}")
    print("回答: ", end='')
    
    chat_with_qwen3_client_stream(question)
    
    # print("\n\n---另一个示例（非流式）---")
    # question = "请解释量子计算的基本原理，至少包含3个要点。"
    # print(f"问题: {question}")
    
    # answer = chat_with_qwen3_client(question)
    # print(f"回答: {answer}")