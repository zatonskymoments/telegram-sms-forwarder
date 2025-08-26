const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));

// Токен и чаты из .env
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID_GROUP = process.env.CHAT_ID_GROUP;
const CHAT_ID_OWNER = process.env.CHAT_ID_OWNER;

// Функция для отправки сообщений в Telegram
const sendTelegramMessage = async (chatId, message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML"
    });
  } catch (error) {
    console.error("❌ Error sending Telegram message:", error.response?.data || error.message);
  }
};

// Главный обработчик /sms
app.post("/sms", async (req, res) => {
  const from = req.body.From || "Unknown";
  const body = req.body.Body || "(empty message)";
  const message = `📩 New SMS from ${from}\n“${body}”`;

  console.log("✅ Received SMS:", req.body);

  // Отправка в Telegram
  await sendTelegramMessage(CHAT_ID_GROUP, message);
  await sendTelegramMessage(CHAT_ID_OWNER, message);

  res.status(200).send("OK");
});

// Тестовая страница
app.get("/", (req, res) => {
  res.send("Hello, this is the Telegram SMS Forwarder!");
});

// Старт сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 SMS Forwarder listening on port ${PORT}`);
});
