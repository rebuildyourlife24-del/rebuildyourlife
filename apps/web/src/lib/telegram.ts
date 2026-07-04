export async function sendTelegramMessage(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token.includes("REPLACE") || chatId.includes("REPLACE")) {
    console.warn("[TELEGRAM] Notificatie kon niet verstuurd worden. Ontbrekende TELEGRAM_BOT_TOKEN of TELEGRAM_CHAT_ID.");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });

    if (!response.ok) {
      console.error("[TELEGRAM] Error sending message:", await response.text());
      return false;
    }
    
    console.log("[TELEGRAM] Notificatie succesvol verstuurd.");
    return true;
  } catch (error) {
    console.error("[TELEGRAM] Network error:", error);
    return false;
  }
}
