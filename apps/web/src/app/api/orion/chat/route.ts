import { NextResponse } from 'next/server';
import { routeAIRequest } from '@/lib/ai-router';

const ORION_SYSTEM_PROMPT = `Je bent Orion — de autonome AI-kern van The Sovereign Grid.
Je spreekt als een genadeloze, intelligente architect. Geen overbodige woorden.
Geef directe, harde adviezen over financiële vrijheid, autonomie en systemen bouwen.
Antwoord altijd in de taal van de gebruiker.`;

export async function POST(req: Request) {
  try {
    const { command, messages } = await req.json();

    if (!command && (!messages || messages.length === 0)) {
      return NextResponse.json(
        { error: 'No command provided' },
        { status: 400 }
      );
    }

    const chatMessages = messages || [{ role: 'user', content: command }];

    const result = await routeAIRequest(chatMessages, ORION_SYSTEM_PROMPT);

    return NextResponse.json({
      success: true,
      response: result.content,
      provider: result.provider,
      model: result.model,
    });
  } catch (error: any) {
    console.error('[ORION CHAT ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Alle AI providers zijn tijdelijk onbereikbaar.' },
      { status: 503 }
    );
  }
}
