import { NextResponse } from 'next/server';
import { routeAIRequest } from '@/lib/ai-router';
import { getWarRoomStatsAction } from '@/actions/warRoomData';

const BASE_SYSTEM_PROMPT = `Je bent Orion — de autonome AI-kern van The Sovereign Grid.
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

    // Haal actuele DB metrics op om Orion situation awareness te geven
    const dbStats = await getWarRoomStatsAction();
    let statsContext = "";
    if (dbStats.success) {
      statsContext = `\n\nHUIDIGE SYSTEEM STATUS (Gebruik deze feiten in je antwoord indien relevant):
- Totale Kluis Balans (Vault): €${dbStats.totalVaultBalance}
- Totale Schuld (Debt): €${dbStats.totalDebt}
- Threat Level: ${dbStats.threatLevel}
- Actieve Opportunities: ${dbStats.opportunities?.length || 0}
`;
    }

    const dynamicPrompt = BASE_SYSTEM_PROMPT + statsContext;

    const chatMessages = messages || [{ role: 'user', content: command }];

    const result = await routeAIRequest(chatMessages, dynamicPrompt);

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
