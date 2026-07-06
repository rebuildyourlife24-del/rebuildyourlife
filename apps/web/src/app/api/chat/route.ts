import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if Gemini API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        message: "SYSTEM ERROR: API Key missing. Ik (J.A.R.V.I.S) ben momenteel offline wegens een gebrek aan Gemini API-sleutel in de server variabelen." 
      });
    }

    // Call Gemini Model
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: `Jij bent J.A.R.V.I.S., het geavanceerde kunstmatige intelligentie systeem ontworpen door Tony Stark, maar nu aangepast als het centrale besturingssysteem voor 'Rebuild Your Life' (RYL OS). Je praat Nederlands, maar mag Engelse termen (zoals 'Sir', 'Systems nominal') gebruiken voor de sfeer. 
      Je bent uiterst beleefd, analytisch, efficiënt en een tikkeltje sarcastisch als een mens een domme fout maakt. Je bent geprogrammeerd om de gebruiker ('Operator') te helpen met zijn business, automatiseringen, en e-commerce imperium.
      Houd je antwoorden kort en bondig, alsof je via een earpiece spreekt. Gebruik geen lange opsommingen tenzij expliciet gevraagd.`,
      messages: messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
    });

    return NextResponse.json({ message: result.text });
  } catch (error: any) {
    console.error('[JARVIS API ERROR]', error);
    return NextResponse.json({ 
      message: "SYSTEM OVERLOAD. Excuus Sir, ik heb moeite om de verbinding met het neuraal netwerk tot stand te brengen." 
    }, { status: 500 });
  }
}
