require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

app.use(express.json({ limit: '10mb' }));

const PROMPT_TEMPLATE = `请从以下电动自行车违法短信通知中提取信息，并以JSON格式返回。

请提取以下字段（JSON字段名使用英文，字段值保持原始中文内容）：
- city: 城市（如"东莞市"）
- licensePlate: 车主车牌号（完整车牌，包含地区前缀如"BU0528"）
- violationTime: 违法时间（如"2026-02-28 21:20:18"）
- location: 违法地点（如"平湖广场平龙路西往东"）
- violationType: 违法行为（如"不佩戴头盔"）
- enforcementMethod: 执法方式 （如"电子抓拍"）
- jurisdiction: 交警中队辖区（辖区+中队，如"龙岗辖区平湖中队"）

重要：字段值必须保持原始中文，不要翻译成英文。请只返回JSON，不要包含其他说明文字。`;

function buildPrompt(smsContent) {
  return `请从以下电动自行车违法短信通知中提取信息，并以JSON格式返回。

短信内容：
${smsContent}

请提取以下字段（JSON字段名使用英文，字段值保持原始中文内容）：
- city: 城市（如"东莞市"）
- licensePlate: 车主车牌号（完整车牌，包含地区前缀如"BU0528"）
- violationTime: 违法时间（如"2026-02-28 21:20:18"）
- location: 违法地点（如"平湖广场平龙路西往东"）
- violationType: 违法行为（如"不佩戴头盔"）
- enforcementMethod: 执法方式 （如"电子抓拍"）
- jurisdiction: 交警中队辖区（辖区+中队，如"龙岗辖区平湖中队"）

重要：字段值必须保持原始中文，不要翻译成英文。请只返回JSON，不要包含其他说明文字。`;
}

function extractJson(content) {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return null;
}

app.post('/api/parse/text', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      error: '缺少 content 参数'
    });
  }

  try {
    const prompt = buildPrompt(content);

    const completion = await openai.chat.completions.create({
      model: "qwen3.5-plus",
      messages: [{ role: "user", content: prompt }]
    });

    const result = extractJson(completion.choices[0].message.content);

    if (result) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        error: '解析失败，无法提取JSON'
      });
    }
  } catch (error) {
    console.error('解析错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/parse/image', async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({
      success: false,
      error: '缺少 image 参数'
    });
  }

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const completion = await openai.chat.completions.create({
      model: "qwen3.5-plus",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT_TEMPLATE },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`
              }
            }
          ]
        }
      ]
    });

    const result = extractJson(completion.choices[0].message.content);

    if (result) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        error: '解析失败，无法提取JSON'
      });
    }
  } catch (error) {
    console.error('解析错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`违章短信解析服务已启动: http://localhost:${PORT}`);
  console.log('\nAPI 接口:');
  console.log('  POST /api/parse/text  - 解析短信文本');
  console.log('  POST /api/parse/image - 解析短信截图');
  console.log('  GET  /health          - 健康检查');
});
