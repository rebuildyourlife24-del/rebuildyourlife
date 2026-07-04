import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

// Helper function to send message back to Telegram
async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not set.");
    return;
  }
  
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    })
  });
}

// Function to call AI (Gemini)
async function getAIResponse(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return "Ik ben momenteel offline. (Geen AI Key gevonden)";
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Je bent GodBrain, de hyperintelligente assistent van RebuildYourLife. Geef beknopte, krachtige antwoorden.\n\nGebruiker zegt: ${prompt}` }] }]
      })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Er ging iets mis met mijn neurale netwerk.";
  } catch (error) {
    console.error(error);
    return "Error in verbinding met GodBrain.";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Telegram sends the message object
    if (!body.message) {
      return NextResponse.json({ status: 'ignored' });
    }

    const chatId = body.message.chat.id.toString();
    const text = body.message.text || '';

    console.log(`[TELEGRAM] Received message from ${chatId}: ${text}`);

    // Check if it's a connect command: /start connect-12345
    if (text.startsWith('/start connect-')) {
      const token = text.split('connect-')[1];
      
      const user = await prisma.user.findUnique({ where: { telegramConnectToken: token } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            telegramChatId: chatId,
            telegramConnectToken: null // reset token na gebruik
          }
        });
        await sendTelegramMessage(chatId, `✅ *Koppeling Succesvol!*\n\nWelkom ${user.firstName}, je account is nu verbonden met GodBrain. Ik sta klaar om je te assisteren. Wat kan ik voor je doen?`);
      } else {
        await sendTelegramMessage(chatId, `❌ Ongeldige of verlopen koppelingscode.`);
      }
      return NextResponse.json({ status: 'ok' });
    }

    // Standard message handling
    const user = await prisma.user.findUnique({ where: { telegramChatId: chatId } });
    if (!user) {
      await sendTelegramMessage(chatId, "⚠️ Je account is nog niet gekoppeld. Ga naar je RebuildYourLife dashboard onder instellingen om deze bot te activeren.");
      return NextResponse.json({ status: 'ok' });
    }

    // Call the AI
    const aiResponse = await getAIResponse(text);
    
    // Send response back
    await sendTelegramMessage(chatId, aiResponse);

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
