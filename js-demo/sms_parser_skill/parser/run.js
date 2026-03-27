#!/usr/bin/env node
require('dotenv').config();
const { parseTrafficViolationSms, parseTrafficViolationFromImage } = require('./sms_parser_aliyun');
const fs = require('fs');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('用法: node run.js "<短信内容>" 或 node run.js --image <图片路径>');
    process.exit(1);
  }

  if (!process.env.DASHSCOPE_API_KEY) {
    console.error(JSON.stringify({ error: 'DASHSCOPE_API_KEY 未配置' }));
    process.exit(1);
  }

  let result;
  
  if (args[0] === '--image' && args[1]) {
    const imagePath = args[1];
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    result = await parseTrafficViolationFromImage(imageBase64);
  } else {
    const smsContent = args.join(' ');
    result = await parseTrafficViolationSms(smsContent);
  }

  if (result) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error(JSON.stringify({ error: '解析失败' }));
  }
}

main();
