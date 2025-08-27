const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// 🔐 Настройки из Environment Variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID_GROUP = process.env.CHAT_ID_GROUP;
const CHAT_ID_OWNER = process.env.CHAT_ID_OWNER;

// Универсальная функция отправки сообщений
const sendTelegramMessage = async (chatId, message) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const res = await axios.post(url, {
      chat_id: String(chatId),
      text: message,
    });
    console.log("✅ Sent to:", chatId);
    return res.data;
  } catch (error) {
    console.error("❌ Telegram Error:", {
      chatId,
      message,
      error_code: error?.response?.data?.error_code,
      description: error?.response?.data?.description,
    });
    return { error: true, details: error?.response?.data };
  }
};

// 🌐 Получение SMS от Twilio
app.post("/sms", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  console.log("📩 SMS:", { from, body });

  const text = `📨 New SMS from ${from}:\n"${body}"`;

  await sendTelegramMessage(CHAT_ID_GROUP, text);

  // (Необязательно) Отправка владельцу
  // await sendTelegramMessage(CHAT_ID_OWNER, text);

  res.send("OK");
});

// 🛠️ Ручка для отладки
app.get("/debug", async (req, res) => {
  const message = "🛠️ Тестовое сообщение от Render по /debug";
  const result = await sendTelegramMessage(CHAT_ID_GROUP, message);
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
