const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // для Telegram Webhook

const TELEGRAM_TOKEN = "8235204551:AAHbhvaTGQGSwlXtZXGaJUqRv2OC2FoZbk4"; // ← не меняй, он твой

// 📥 Telegram webhook — выводит все входящие update
app.post("/webhook", async (req, res) => {
  console.log("📦 Telegram update received:");
  console.log(JSON.stringify(req.body, null, 2)); // 👈 chat_id будет тут

  res.status(200).send("OK");
});

// Простой health-check
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
