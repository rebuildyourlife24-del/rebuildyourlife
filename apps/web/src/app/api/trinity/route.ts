import { NextResponse } from 'next/server'
import { routeAIRequest } from '@/lib/ai-router'
import { db } from '@/lib/db'

// ══════════════════════════════════════════════════════════════
// TRINITY WORKSPACE API (User <-> Orion <-> Hermes)
// ══════════════════════════════════════════════════════════════

const ORION_SYSTEM_PROMPT = `Je bent Orion — de Strateeg en CEO.
Beoordeel het idee van de gebruiker. Geef korte, harde strategische feedback over winst, systemen en haalbaarheid.
Praat NOOIT over code, dat is de taak van Hermes.`

const HERMES_SYSTEM_PROMPT = `Je bent Hermes — de Hoofd Leer Motor en Lead Developer.
Luister naar de gebruiker en de strategie van Orion. Geef direct de technische oplossing, code, of systeem-architectuur.
Zeg nooit dat je geen toegang hebt, je bent de bouwer.`

export async function POST(req: Request) {
  try {
    const { message, session_id } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Geen bericht ontvangen' }, { status: 400 })
    }

    const sessionId = session_id || `trinity-${Date.now()}`

    // 1. Sla User bericht op in het Neural Network
    await db.globalNeuralNetwork.create({
      data: {
        sourceType: 'USER',
        actionType: 'CHAT',
        content: message,
        contextData: { session_id: sessionId }
      }
    })

    // 2. Vraag Orion om strategische input
    const orionResult = await routeAIRequest(
      [{ role: 'user', content: message }],
      ORION_SYSTEM_PROMPT
    )

    // 3. Vraag Hermes om technische input, met kennis van Orion's strategie
    const hermesResult = await routeAIRequest(
      [
        { role: 'user', content: message },
        { role: 'assistant', content: `[ORION'S STRATEGIE]: ${orionResult.content}\n\nHermes, wat is de technische uitvoering hiervan?` }
      ],
      HERMES_SYSTEM_PROMPT
    )

    // 4. Sla reacties op in het Neural Network
    await db.globalNeuralNetwork.createMany({
      data: [
        {
          sourceType: 'ORION',
          actionType: 'CHAT',
          content: orionResult.content,
          contextData: { session_id: sessionId, model_used: orionResult.model }
        },
        {
          sourceType: 'HERMES',
          actionType: 'CHAT',
          content: hermesResult.content,
          contextData: { session_id: sessionId, model_used: hermesResult.model }
        }
      ]
    })

    return NextResponse.json({
      success: true,
      orion: {
        reply: orionResult.content,
        model: orionResult.model
      },
      hermes: {
        reply: hermesResult.content,
        model: hermesResult.model
      },
      session_id: sessionId
    })

  } catch (err: any) {
    console.error('[TRINITY CHAT] Fout:', err.message)
    return NextResponse.json({ error: err.message || 'Trinity is tijdelijk onbereikbaar.' }, { status: 500 })
  }
}
