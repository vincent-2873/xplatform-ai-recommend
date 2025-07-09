const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(express.static("."));
app.use(bodyParser.json());

app.post("/api", async (req, res) => {
  const userInput = req.body.input;

  const prompt = `
你是一位了解課程與技能發展的教育顧問。根據下列學員描述，請推薦對應的專案名稱、是否能接案、分類（A/B/C）、推薦套餐與業務用話術。

學員狀況：
${userInput}

請用條列式給出建議，包含：
- 專案名稱
- 是否可接案
- 分類
- 推薦套餐
- 話術建議
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  let reply = '⚠️ 發生錯誤，請稍後再試。';
if (data && data.choices && data.choices.length > 0) {
  reply = data.choices[0].message.content;
} else {
  console.error('OpenAI 回傳格式異常：', JSON.stringify(data));
}

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
