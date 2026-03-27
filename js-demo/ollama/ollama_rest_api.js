const fs = require('fs');

/**
 * 使用Node.js通过HTTP请求与Ollama的qwen3:8b模型进行流式交互
 */
async function chatWithQwen3Stream(prompt, model = 'qwen3:8b') {
  const url = 'http://localhost:11434/api/generate';
  
  const payload = {
    model: model,
    prompt: prompt,
    stream: true  // 设置为true以启用流式输出
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      // 获取响应流
      const reader = response.body;
      
      // 读取流数据
      for await (const chunk of reader) {
        const decodedChunk = new TextDecoder().decode(chunk);
        // Ollama流式响应每行是一个独立的JSON对象
        const lines = decodedChunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const jsonData = JSON.parse(line);
            if (jsonData.response) {
              process.stdout.write(jsonData.response);
            }
          } catch (parseError) {
            // 忽略解析错误
          }
        }
      }
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    return null;
  }
}

/**
 * 使用Node.js通过HTTP请求与Ollama的qwen3:8b模型进行交互（非流式）
 */
async function chatWithQwen3(prompt, model = 'qwen3:8b') {
  const url = 'http://localhost:11434/api/generate';
  
  const payload = {
    model: model,
    prompt: prompt,
    stream: false  // 设置为false以获得完整响应
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.response;
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    return null;
  }
}

// 主函数 - 演示如何使用
async function main() {
  // 示例1：向模型提问（流式输出）
  const question1 = "请用5句话描述人工智能的发展历程。";
  console.log(`问题: ${question1}`);
  process.stdout.write("回答: ");
  
  await chatWithQwen3Stream(question1);
  
  console.log('\n\n---另一个示例（非流式）---');
  
//   // 示例2：编程相关问题
//   const question2 = "请用5句话描述人工智能的发展历程。";
//   console.log(`问题: ${question2}`);
  
//   const answer2 = await chatWithQwen3(question2);
//   if (answer2) {
//     console.log(`回答: ${answer2}`);
//   }
}

// 运行主函数
main();