#!/usr/bin/env node

require('dotenv').config();
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

const PROMPT_TEMPLATE = `请从以下电动自行车违法短信通知中提取信息，并以JSON格式返回。

请提取以下字段（JSON字段名使用英文，字段值保持原始中文内容）：
- city: 城市（如"东莞市"）
- licensePlate: 车主车牌号（完整车牌，如"BU0528"）
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
- licensePlate: 车主车牌号（完整车牌，如"BU0528"）
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

async function parseText(smsContent) {
  const prompt = buildPrompt(smsContent);
  const completion = await openai.chat.completions.create({
    model: "qwen3.5-plus",
    messages: [{ role: "user", content: prompt }]
  });
  return extractJson(completion.choices[0].message.content);
}

async function parseImage(imageBase64) {
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
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
  return extractJson(completion.choices[0].message.content);
}

const server = new McpServer({
  name: "sms-parser",
  version: "1.0.0"
});

server.tool(
  "parse_sms_text",
  "解析电动自行车违法短信文本，提取城市、车牌号、违法时间、地点、违法行为、执法方式、辖区等信息",
  {
    content: z.string().describe("短信文本内容")
  },
  async ({ content }) => {
    try {
      const result = await parseText(content);
      if (result) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
      } else {
        return {
          content: [{
            type: "text",
            text: "解析失败，无法提取信息"
          }],
          isError: true
        };
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `解析错误: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "parse_sms_image",
  "解析电动自行车违法短信截图，从图片中提取城市、车牌号、违法时间、地点、违法行为、执法方式、辖区等信息",
  {
    image: z.string().describe("图片的Base64编码")
  },
  async ({ image }) => {
    try {
      const result = await parseImage(image);
      if (result) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
      } else {
        return {
          content: [{
            type: "text",
            text: "解析失败，无法提取信息"
          }],
          isError: true
        };
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `解析错误: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
