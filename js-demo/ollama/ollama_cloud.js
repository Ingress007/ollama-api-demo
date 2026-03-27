require('dotenv').config();
const ollama = require('ollama');

const client = new ollama.Ollama({
  host: 'https://ollama.com',
  headers: {
    'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY
  }
});

async function chatStream() {
  const messages = [
    {
      role: 'user',
      content: '天空为啥是蓝色的?'
    }
  ];

  try {
    const stream = await client.chat({
      model: 'gpt-oss:120b',
      messages: messages,
      stream: true
    });

    for await (const part of stream) {
      process.stdout.write(part.message.content);
    }
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }
}

chatStream();
