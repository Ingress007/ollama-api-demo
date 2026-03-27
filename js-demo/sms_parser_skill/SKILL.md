---
name: "sms_parser_skill"
description: "Parses traffic violation SMS notifications using Aliyun Qwen AI. Invoke when user needs to extract structured data from traffic violation SMS or screenshots."
---

# SMS Parser Skill

This skill provides AI-powered parsing of traffic violation SMS notifications using Aliyun's Qwen model.

## Features

- Parse traffic violation SMS text content
- Parse traffic violation SMS from screenshots (images)
- Extract structured data including:
  - City
  - License plate number
  - Violation time
  - Location
  - Violation type
  - Enforcement method
  - Jurisdiction

## Configuration

Before using this skill, configure `DASHSCOPE_API_KEY` in `parser/.env` file.

Get your API key from: https://dashscope.console.aliyun.com/

## How to Use (For Agent)

### Parse SMS Text

When user provides SMS text content, run the following command:

```bash
node <skill_dir>/parser/run.js "短信内容"
```

Example:
```bash
node parser/run.js "【深圳交警】尊敬的深圳BU0528车主，您于2026-02-28 21:20:18在平湖广场平龙路西往东因非机动车占用机动车道被抓拍..."
```

### Parse from Image

```bash
node <skill_dir>/parser/run.js --image <图片路径>
```

## Output Format

Returns a JSON object:

```json
{
  "city": "深圳市",
  "licensePlate": "BU0528",
  "violationTime": "2026-02-28 21:20:18",
  "location": "平湖广场平龙路西往东",
  "violationType": "非机动车占用机动车道",
  "enforcementMethod": "电子抓拍",
  "jurisdiction": "龙岗辖区平湖中队"
}
```

## Installation

```bash
cd parser
npm install
```

## Dependencies

- openai (for API calls)
- dotenv (for environment variables)
