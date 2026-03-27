const { Ollama } = require('ollama');

const client = new Ollama({ host: 'http://localhost:11434' });

async function parseTrafficViolationSms(smsContent) {
  const prompt = `请从以下电动自行车违法短信通知中提取信息，并以JSON格式返回。

短信内容：
${smsContent}

请提取以下字段（JSON字段名使用英文，字段值保持原始中文内容）：
- city: 城市（如"深圳市"）
- licensePlate: 车主车牌号（完整车牌，如"BU0528"）
- violationTime: 违法时间（如"2026-02-28 21:20:18"）
- location: 违法地点（如"平湖广场平龙路西往东"）
- violationType: 违法行为（如"不佩戴头盔"）
- enforcementMethod: 执法方式 （如“电子抓拍”）
- jurisdiction: 交警中队辖区（辖区+中队，如"龙岗辖区平湖中队"）

重要：字段值必须保持原始中文，不要翻译成英文。请只返回JSON，不要包含其他说明文字。`;

  try {
    const response = await client.chat({
      model: 'qwen3:4b',
      messages: [{ role: 'user', content: prompt }],
      stream: false
    });

    const content = response.message.content;
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

async function main() {
  const smsContent = `【深圳交警】尊敬的深圳BU0528车主，您于2026-02-28 21:20:18在平湖广场平龙路西往东因非机动车占用机动车道被抓拍。请骑行人携身份证到平湖中队（19007562589）或龙岗辖区就近中队处理。办公时间：工作日9:00-12:00,14:00-18:00；周末9:00-12:00，15:00-18:00。重点提醒：拒绝接受处理或多次违法将影响个人征信。`;

  console.log('=== 电动自行车违法短信解析工具 ===\n');
  console.log('原始短信内容:');
  console.log(smsContent);
  console.log('\n正在解析...\n');

  const result = await parseTrafficViolationSms(smsContent);

  if (result) {
    console.log('解析结果 (JSON格式):');
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('解析失败');
  }
}

main();
