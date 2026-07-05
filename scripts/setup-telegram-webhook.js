// scripts/setup-telegram-webhook.js
// Run dit met: node scripts/setup-telegram-webhook.js
require('dotenv').config({ path: '.env' });

const token = process.env.TELEGRAM_BOT_TOKEN;
// Verander dit naar je live productie domein wanneer de Vercel deploy klaar is!
const webhookUrl = "https://rebuildyourlife.eu/api/telegram/webhook";

if (!token) {
  console.error("Geen TELEGRAM_BOT_TOKEN gevonden in .env");
  process.exit(1);
}

const url = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log(`✅ Webhook succesvol ingesteld op: ${webhookUrl}`);
    } else {
      console.error("❌ Fout bij instellen webhook:", data.description);
    }
  })
  .catch(err => {
    console.error("Netwerk fout:", err);
  });
