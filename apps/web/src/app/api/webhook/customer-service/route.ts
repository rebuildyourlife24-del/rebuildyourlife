import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Dit is de API Endpoint voor Verdienmodel 1: AI Klantenservice
// Wordt aangeroepen door Shopify Inbox / Zendesk webhooks

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeName, customerName, customerMessage, orderId, orderStatus } = body;

    if (!customerMessage) {
      return NextResponse.json({ success: false, error: 'Klantbericht ontbreekt' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is niet ingesteld in de server environment.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemInstruction = `Je bent een uiterst professionele en empathische AI klantenservice medewerker voor de webshop "${storeName || 'onze winkel'}".
Jouw taak is om autonoom een antwoord te formuleren op de vraag of klacht van de klant.
Regels:
1. Wees altijd beleefd, meelevend en oplossingsgericht.
2. Gebruik de beschikbare order-informatie indien relevant.
3. Spreek de klant aan met de voornaam als deze bekend is.
4. Sluit af met een professionele groet namens het support team.
5. Verzin GEEN valse beloftes. Als het order-status 'verzonden' is, benadruk dan dat het onderweg is.
`;

    const prompt = `
[ORDER INFORMATIE]
Klant: ${customerName || 'Klant'}
Order ID: ${orderId || 'Niet vermeld'}
Order Status: ${orderStatus || 'Onbekend'}

[BERICHT VAN KLANT]
"${customerMessage}"

Schrijf nu het perfecte antwoord namens de webshop:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.3, // Lager voor meer professionele, voorspelbare antwoorden
      }
    });

    const aiResponse = result.response.text();

    // In een echte productie-omgeving sturen we hier de response TERUG naar de Zendesk/Shopify API
    // Bijv: await fetch('https://[store].myshopify.com/admin/api/2024-01/inbox/messages.json', { ... })

    return NextResponse.json({
      success: true,
      data: {
        ai_reply: aiResponse,
        action_taken: "REPLY_GENERATED",
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[Customer Service Webhook] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
