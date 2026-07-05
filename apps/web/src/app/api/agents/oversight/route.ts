import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ══════════════════════════════════════════════════════════════
// OVERSIGHT TELEMETRY API
// Haalt de beveiligde "Black Box" logboeken op uit het systeem
// ══════════════════════════════════════════════════════════════

export async function GET() {
  try {
    console.log('[OVERSIGHT] Ophalen van telemetrie-data...');

    // We halen de laatste 100 acties op van Hermes en Orions
    const logs = await db.globalNeuralNetwork.findMany({
      where: {
        sourceType: {
          in: ['HERMES', 'ORION']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100,
      select: {
        id: true,
        sourceType: true,
        actionType: true,
        content: true,
        contextData: true,
        createdAt: true
      }
    });

    // Haal statistieken op voor het Human-in-the-Loop overzicht
    const pendingActions = await db.hermesPrediction.count({
      where: {
        suggestedAction: 'Review in Dashboard' // Acties die wachten op goedkeuring
      }
    });

    return NextResponse.json({
      success: true,
      data: logs,
      stats: {
        pending_approvals: pendingActions,
        total_logs: logs.length
      }
    });

  } catch (error: any) {
    console.error('[OVERSIGHT] Fout bij ophalen logs:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
