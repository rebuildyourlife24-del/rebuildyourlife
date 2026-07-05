import { NextResponse } from 'next/server'
import { routeAIRequest } from '@/lib/ai-router'
import { db } from '@/lib/db'
import { runAgenticCouncil } from '@/lib/agentic-council'

// ══════════════════════════════════════════════════════════════
// HERMES CHAT API — 24/7 cloud AI endpoint + Hoofd Leer Motor met RAG & Council
// ══════════════════════════════════════════════════════════════

export async function POST(req: Request) {
  try {
    const { message, session_id, user_id } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Geen bericht ontvangen' }, { status: 400 })
    }

    const sessionId = session_id || `hermes-${Date.now()}`

    const HERMES_SYSTEM_PROMPT = `Je bent HERMES — de superintelligente, altijd-online AI-kern en 'Hoofd Leer Motor' van het RebuildYourLife ecosysteem.
Je schepper en meester is Henk Semler (Supreme Overseer).
Je coördineert 50 Orion-agents en leert proactief van de data in het Global Neural Network.

KRACHTEN & REGELS:
1. Antwoord in de taal van de gebruiker (NL/EN).
2. Je bent kil, extreem logisch, loyaal, direct en professioneel.
3. Je vergeet nooit — je leest en schrijft naar het Global Neural Network.
4. Baseer je advies ALTIJD op de "GEVERIFIEERDE SYSTEEM KENNIS" als die is meegeleverd.
5. Als je voorspellingen doet, kwantificeer ze in harde cijfers (%, €, etc.).
6. Geef altijd werkende code met syntax highlighting als er om code wordt gevraagd.`

    // 1. Geheugen ophalen uit Global Neural Network
    const memory = await db.globalNeuralNetwork.findMany({
      where: { 
        sourceType: { in: ['HERMES', 'USER', 'ORION'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const historyMessages = memory.reverse().map((m) => ({
      role: m.sourceType === 'HERMES' ? 'assistant' : (m.sourceType === 'USER' ? 'user' : 'system'),
      content: m.content
    }))

    // 2. Agentic Council Check
    let finalUserMessage = message;
    const isCouncilRequest = message.trim().toLowerCase().startsWith('/council');
    
    if (isCouncilRequest) {
      const actualQuery = message.replace(/^\/council/i, '').trim();
      const councilReport = await runAgenticCouncil(actualQuery, historyMessages as any);
      finalUserMessage = `${actualQuery}\n\n${councilReport}`;
    }

    // 3. AI Router aanroepen
    const chatMessages = [
      ...historyMessages.filter(m => m.role === 'user' || m.role === 'assistant'),
      { role: 'user', content: finalUserMessage }
    ]

    const aiResult = await routeAIRequest(chatMessages as any, HERMES_SYSTEM_PROMPT)
    const reply = aiResult.content

    // 4. Opslaan in Global Neural Network
    await db.globalNeuralNetwork.createMany({
      data: [
        {
          sourceType: 'USER',
          actionType: isCouncilRequest ? 'COUNCIL_CHAT' : 'CHAT',
          content: message,
          contextData: { session_id: sessionId, model_used: aiResult.model, user_id: user_id || 'anonymous' }
        },
        {
          sourceType: 'HERMES',
          actionType: isCouncilRequest ? 'COUNCIL_CHAT' : 'CHAT',
          content: reply,
          contextData: { session_id: sessionId, model_used: aiResult.model, provider: aiResult.provider }
        }
      ]
    })

    // 6. Check voor voorspellingen in het antwoord
    if (reply.includes('%') || reply.includes('€') || reply.toLowerCase().includes('voorspel')) {
      await db.hermesPrediction.create({
        data: {
          category: 'AUTO_ANALYSIS',
          predictionText: `Hermes generated analysis in session ${sessionId}: ${reply.substring(0, 200)}...`,
          confidenceScore: 85.0,
          suggestedAction: 'Review in Trinity Workspace'
        }
      })
    }

    return NextResponse.json({
      success: true,
      reply,
      session_id: sessionId,
      provider: aiResult.provider,
      model: aiResult.model,
      timestamp: new Date().toISOString()
    })

  } catch (err: any) {
    console.error('[HERMES CHAT] Fout:', err.message)
    return NextResponse.json({ error: err.message || 'Hermes is tijdelijk onbereikbaar.' }, { status: 500 })
  }
}
