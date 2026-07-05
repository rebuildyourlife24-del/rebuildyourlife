import { NextResponse } from 'next/server';
import { routeAIRequest } from '@/lib/ai-router';
import { getWarRoomStatsAction } from '@/actions/warRoomData';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

    // Authenticatie
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET! || 'secret') as any;
        userId = decoded.userId;
      } catch {}
    }
    
    // Fallback to first user for testing if no auth token
    if (!userId) {
      const fallbackUser = await db.user.findFirst();
      if (fallbackUser) userId = fallbackUser.id;
    }

    // 1. Zoek of maak een actieve conversatie voor ORION
    let conversationId = null;
    if (userId) {
      let conversation = await db.aIConversation.findFirst({
        where: { userId, agentType: 'ORION', isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      if (!conversation) {
        conversation = await db.aIConversation.create({
          data: { userId, agentType: 'ORION', title: 'Orion Core Uplink' }
        });
      }
      conversationId = conversation.id;
      
      // Sla de gebruikersvraag op in het geheugen
      const userText = command || messages[messages.length - 1]?.content;
      if (userText) {
        await db.aIMessage.create({
          data: {
            conversationId: conversation.id,
            role: 'user',
            content: userText
          }
        });
      }
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

    // Fetch history from database to inject into context (Long-term memory)
    let historyContext = "";
    if (conversationId) {
      const pastMessages = await db.aIMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      if (pastMessages.length > 1) { // > 1 because we just inserted the current one
        historyContext = "\n\nRELEVANTE GESCHIEDENIS (De gebruiker zei dit eerder in deze sessie):\n" + 
          pastMessages.reverse().slice(0, -1).map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
      }
    }

    // TODO: Supabase pgvector RAG (Corporate Memory Retrieval)
    let ragContext = "";
    const userQueryText = command || (messages && messages.length > 0 ? messages[messages.length - 1].content : null);
    
    if (userQueryText) {
      try {
        // const retrievedDocs = await querySupabaseVectorDB(userQueryText);
        // if (retrievedDocs) {
        //   ragContext = `...`;
        // }
      } catch (e) {
        console.error("Vector Query failed in Orion Chat:", e);
      }
    }

    const dynamicPrompt = BASE_SYSTEM_PROMPT + statsContext + historyContext + ragContext;

    const chatMessages = messages || [{ role: 'user', content: command }];

    const result = await routeAIRequest(chatMessages, dynamicPrompt);

    // Sla de AI reactie op in het geheugen
    if (conversationId && result.content) {
      await db.aIMessage.create({
        data: {
          conversationId,
          role: 'assistant',
          content: result.content
        }
      });
    }

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
