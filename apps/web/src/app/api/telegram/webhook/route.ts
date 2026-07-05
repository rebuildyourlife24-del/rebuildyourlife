import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
// Import the local routeAIRequest directly without going through the edge logic 
import { routeAIRequest } from '@/lib/ai-router';

// Helper to send messages back to Telegram
async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Ignore edits or other types of updates for now
    if (!body.message) return new NextResponse('OK', { status: 200 });

    const chatId = body.message.chat.id.toString();
    const text = body.message.text;

    if (!text) return new NextResponse('OK', { status: 200 });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN ontbreekt in Vercel.");
      return new NextResponse('OK', { status: 200 });
    }

    // 1. Account Koppelen Logica
    if (text.startsWith('/link ')) {
      const email = text.split(' ')[1]?.trim();
      if (!email) {
        await sendTelegramMessage(chatId, "Gebruik: /link <jouw-email>");
        return new NextResponse('OK', { status: 200 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        await sendTelegramMessage(chatId, `Geen account gevonden met e-mailadres: ${email}. Probeer het opnieuw.`);
        return new NextResponse('OK', { status: 200 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { telegramChatId: chatId }
      });

      await sendTelegramMessage(chatId, `✅ Account gekoppeld! Welkom terug, ${user.firstName}. Ik ben Hermes, je uitvoerende AI. Wat moet ik voor je regelen?`);
      return new NextResponse('OK', { status: 200 });
    }

    // 2. Zoek de gekoppelde gebruiker op basis van Chat ID
    const user = await prisma.user.findUnique({
      where: { telegramChatId: chatId }
    });

    if (!user) {
      await sendTelegramMessage(chatId, "⚠️ Dit apparaat is niet gekoppeld. Typ '/link <jouw-email>' om je Sovereign OS account te verbinden.");
      return new NextResponse('OK', { status: 200 });
    }

    // 3. Stuur bericht naar the Sovereign AI Router (Hermes als default voor telegram)
    try {
      const systemPrompt = "Je bent Hermes, de 24/7 AI-Uitvoerder via Telegram. Geef hele korte, krachtige antwoorden omdat het een mobiele chat is. Geen lange lappen tekst. Spreek in het Nederlands.";
      const messagesForApi = [{ role: 'user' as const, content: text }];
      
      const routerResponse = await routeAIRequest(messagesForApi, systemPrompt);
      const aiText = routerResponse.content.replace(/<<<EXECUTE_COMMAND>>>([\s\S]*?)<<<END_EXECUTE_COMMAND>>>/g, "\n[⚙️ Commando ontvangen, uitvoer voltooid via core-engine.]\n");

      // Reply back to telegram
      await sendTelegramMessage(chatId, aiText);

    } catch (aiError) {
      console.error("Telegram AI Error:", aiError);
      await sendTelegramMessage(chatId, "Er ging iets mis met het bereiken van The Godbrain. Probeer het zo nog eens.");
    }

    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
