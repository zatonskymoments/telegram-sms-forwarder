const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID_GROUP = process.env.CHAT_ID_GROUP;
const CHAT_ID_OWNER = process.env.CHAT_ID_OWNER;

const sendTelegramMessage = async (chatId, message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML"
    });
  } catch (error) {
    console.error("Error sending Telegram message:", error.response?.data || error.message);
  }
};

app.post("/sms", async (req, res) => {
  const from = req.body.From || "Unknown";
  const body = req.body.Body || "(empty message)";
  const message = `📩 New SMS from ${from}
“${body}”`;

  await sendTelegramMessage(CHAT_ID_GROUP, message);
  await sendTelegramMessage(CHAT_ID_OWNER, message);

  res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMS Forwarder listening on port ${PORT}`);
});