const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // обязательно для Telegram webhook

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID_GROUP = process.env.CHAT_ID_GROUP;
const CHAT_ID_OWNER = process.env.CHAT_ID_OWNER;

// 🔧 Принудительно приводим chatId к строке
const sendTelegramMessage = async (chatId, message) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const res = await axios.post(url, {
      chat_id: String(chatId),
      text: message,
    });
    console.log("✅ Message sent successfully to:", chatId);
    return res.data;
  } catch (error) {
    console.error("❌ Error sending Telegram message:", {
      chatId,
      message,
      error_code: error?.response?.data?.error_code,
      description: error?.response?.data?.description,
    });
    return { error: true, details: error?.response?.data };
  }
};

// 🌐 Основная ручка для получения SMS от Twilio
app.post("/sms", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  console.log("📩 Incoming SMS:", { from, body });
  console.log("🌐 Chat ID from env:", CHAT_ID_GROUP);

  const text = `📨 New SMS from ${from}:\n"${body}"`;

  await sendTelegramMessage(CHAT_ID_GROUP, text);
  // await sendTelegramMessage(CHAT_ID_OWNER, text); // если нужно владельцу тоже

  res.send("OK");
});

// 🛠️ Временная ручка для отладки
app.get("/debug", async (req, res) => {
  const message = "🛠️ Тестовое сообщение от Render по /debug";
  const result = await sendTelegramMessage(CHAT_ID_GROUP, message);
  res.json(result);
});

// 📥 Telegram webhook — логируем ВСЕ апдейты
app.post(`/bot${TELEGRAM_TOKEN}`, (req, res) => {
  console.log("📥 ПРИШЕЛ UPDATE ОТ TELEGRAM:");
  console.dir(req.body, { depth: null });
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
