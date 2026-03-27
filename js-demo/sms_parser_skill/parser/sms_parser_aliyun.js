require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

async function parseTrafficViolationSms(smsContent) {
  const prompt = `请从以下电动自行车违法短信通知中提取信息，并以JSON格式返回。

短信内容：
${smsContent}

请提取以下字段（JSON字段名使用英文，字段值保持原始中文内容）：
- city: 城市（如"东莞市"）
- licensePlate: 车主车牌号（完整车牌，如"BU0528"）
- violationTime: 违法时间（如"2026-02-28 21:20:18"）
- location: 违法地点（如"平湖广场平龙路西往东"）
- violationType: 违法行为（如"不佩戴头盔"）
- enforcementMethod: 执法方式 （如"电子抓拍"）
- jurisdiction: 交警中队辖区（辖区+中队，如"龙岗辖区平湖中队"）

重要：字段值必须保持原始中文，不要翻译成英文。请只返回JSON，不要包含其他说明文字。`;

  try {
    const completion = await openai.chat.completions.create({
      model: "qwen3.5-plus",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('无法从响应中提取JSON');
    }
  } catch (error) {
    console.error('解析错误:', error);
    return null;
  }
}

async function parseTrafficViolationFromImage(imageBase64) {
  const prompt = `请从以下电动自行车违法短信截图通知中提取信息，并以JSON格式返回。

请提取以下字段（JSON字段名使用英文，字段值保持原始中文内容）：
- city: 城市（如"东莞市"）
- licensePlate: 车主车牌号（完整车牌，如"BU0528"）
- violationTime: 违法时间（如"2026-02-28 21:20:18"）
- location: 违法地点（如"平湖广场平龙路西往东"）
- violationType: 违法行为（如"不佩戴头盔"）
- enforcementMethod: 执法方式 （如"电子抓拍"）
- jurisdiction: 交警中队辖区（辖区+中队，如"龙岗辖区平湖中队"）

重要：字段值必须保持原始中文，不要翻译成英文。请只返回JSON，不要包含其他说明文字。`;

  try {
    const completion = await openai.chat.completions.create({
      model: "qwen3.5-plus",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('无法从响应中提取JSON');
    }
  } catch (error) {
    console.error('解析错误:', error);
    return null;
  }
}

module.exports = {
  parseTrafficViolationSms,
  parseTrafficViolationFromImage
};
