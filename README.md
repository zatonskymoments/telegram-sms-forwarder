# Telegram SMS Forwarder

This Node.js service receives SMS messages from Twilio and forwards them to a Telegram group and a personal Telegram account.

## 🌐 Deployment (e.g. on Render.com)

1. Fork this repo to your GitHub account
2. Create a new Web Service on Render and connect your repo
3. Use these environment variables:

```
TELEGRAM_TOKEN=your_bot_token
CHAT_ID_GROUP=your_group_chat_id
CHAT_ID_OWNER=your_personal_telegram_id
```

4. Build Command: `npm install`
5. Start Command: `node index.js`

## 📩 Twilio Setup

1. Go to your Twilio phone number settings
2. In the "Messaging" section, set **Webhook (POST)** to:

```
https://your-render-url.onrender.com/sms
```

Done!