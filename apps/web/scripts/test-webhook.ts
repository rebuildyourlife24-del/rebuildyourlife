import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../../../.env') });

async function testMake() {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("Geen MAKE_WEBHOOK_URL gevonden in .env");
    return;
  }

  console.log("🚀 Vuren naar Webhook:", webhookUrl);
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: "APP-TEST-999",
        userId: "test-user-id",
        platform: "TEST",
        content: "Dit bericht is gegenereerd door Sovereign OS om te controleren of de verbinding werkt!",
        mediaUrl: null,
        timestamp: new Date().toISOString()
      })
    });

    console.log("✅ Resultaat Status:", response.status, response.statusText);
    const text = await response.text();
    console.log("✅ Resultaat Data:", text);
  } catch (err) {
    console.error("❌ Fout:", err);
  }
}

testMake();
