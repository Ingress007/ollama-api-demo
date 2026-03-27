
const { Ollama } = require('ollama');

// 初始化Ollama客户端
const client = new Ollama({ host: 'http://localhost:11434' });

/**
 * 使用Ollama JS客户端与qwen3:8b模型进行流式交互
 * @param {string} prompt - 用户输入的提示词
 * @param {string} model - 模型名称，默认为'qwen3:8b'
 */
async function chatWithQwen3Stream(prompt, model = 'qwen3:8b') {
  try {
    // 使用流式方式发送聊天请求
    const stream = await client.chat({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    });

    process.stdout.write('回答 (流式): ');
    
    // 处理流式响应
    for await (const chunk of stream) {
      process.stdout.write(chunk.message.content);
    }
    
    console.log('\n'); // 添加换行
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
  }
}

/**
 * 使用Ollama JS客户端与qwen3:8b模型进行交互（非流式）
 * @param {string} prompt - 用户输入的提示词
 * @param {string} model - 模型名称，默认为'qwen3:8b'
 * @returns {Promise<string>} 模型的完整响应
 */
async function chatWithQwen3(prompt, model = 'qwen3:8b') {
  try {
    // 使用非流式方式发送聊天请求
    const response = await client.chat({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    });

    return response.message.content;
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    return null;
  }
}

// 主函数 - 演示如何使用
async function main() {
  console.log('=== Ollama JS 客户端调用示例 ===\n');
  
  // 示例1：向模型提问（流式输出）
  const question1 = "请用5句话描述人工智能的发展历程。";
  console.log(`问题1: ${question1}`);
  await chatWithQwen3Stream(question1);
  
  console.log('\n------------------------\n');
  
  // 示例2：向模型提问（非流式输出）
  const question2 = "什么是机器学习？请简要解释。";
  console.log(`问题2: ${question2}`);
  
  const answer2 = await chatWithQwen3(question2);
  if (answer2) {
    console.log(`回答 (非流式): ${answer2}`);
  }
  
  console.log('\n=== 示例结束 ===');
}

// 运行主函数
main();