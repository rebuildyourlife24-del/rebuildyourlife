import { NextResponse } from 'next/server'
import { routeAIRequest } from '@/lib/ai-router'
import { db } from '@/lib/db'

// ══════════════════════════════════════════════════════════════
// HERMES LEARNING ENGINE (Cron/Trigger endpoint)
// ══════════════════════════════════════════════════════════════

const HERMES_LEARNING_PROMPT = `Je bent HERMES — de 'Hoofd Leer Motor' van het ecosysteem.
Je taak is om de datastroom van de 50 RYL Agents te analyseren. 
Zoek naar patronen, inefficiënties, en succesvolle strategieën.
Formuleer een voorspelling of optimalisatie-voorstel. Geef je analyse in kort, direct Nederlands.`

export async function POST(req: Request) {
  try {
    // ── Haal recente activiteiten op uit het Global Neural Network ────────────────────
    const recentActivities = await db.globalNeuralNetwork.findMany({
      where: { 
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Laatste 24 uur
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { agent: true }
    })

    if (recentActivities.length === 0) {
      return NextResponse.json({ status: 'Geen nieuwe data om van te leren.' })
    }

    const dataSummary = recentActivities.map(a => 
      `[${a.sourceType}] ${a.agent?.name || 'Onbekend'}: ${a.actionType} -> ${a.content}`
    ).join('\n')

    // ── AI Router aanroepen om te leren ──────────────────────────────────
    const aiResult = await routeAIRequest(
      [{ role: 'user', content: `Analyseer deze data van de afgelopen 24 uur en genereer een inzichtsrapport/voorspelling:\n\n${dataSummary}` }],
      HERMES_LEARNING_PROMPT
    )

    const insight = aiResult.content

    // ── Sla het inzicht op als Predictie ────────────────────────────────────────
    await db.hermesPrediction.create({
      data: {
        category: 'SYSTEM_EVOLUTION',
        predictionText: insight,
        confidenceScore: 92.5,
        suggestedAction: 'Update Agent Prompts of stuur naar Orion voor goedkeuring'
      }
    })

    // Sla het feit dat Hermes heeft geleerd ook op in het Neural Network
    await db.globalNeuralNetwork.create({
      data: {
        sourceType: 'HERMES',
        actionType: 'LEARN',
        content: `Dagelijkse leer-cyclus voltooid. Inzicht gegenereerd: ${insight.substring(0, 100)}...`,
        impactScore: 10.0
      }
    })

    return NextResponse.json({
      success: true,
      insight,
      activitiesProcessed: recentActivities.length,
      provider: aiResult.provider
    })

  } catch (err: any) {
    console.error('[HERMES LEARN] Fout:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
