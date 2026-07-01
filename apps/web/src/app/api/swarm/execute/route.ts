import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { OrionIntelligenceService } from '@/lib/services/orion.service';
import { HermesExecutionService } from '@/lib/services/hermes.service';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction(); const user = session?.user;
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const query = body.query || "Zoek naar gaten in de markt voor Q4 Dropshipping";

    // 1. DE JAGER (ORION) START
    // Orion leest Evolution Logs en genereert een Intel Dossier
    const dossier = await OrionIntelligenceService.performMarketReconnaissance(user.id, query);

    // 2. DE ESTAFETTE (HANDOFF)
    // Het dossier wordt intern doorgegeven aan Hermes
    
    // 3. DE HANDELAAR (HERMES) EXECUTEERT
    // Hermes checkt risk/budget en plaatst het in de Control Matrix
    const result = await HermesExecutionService.evaluateOrionDossierAndPrepare(user.id, dossier);

    return NextResponse.json({
      success: true,
      message: 'Swarm Relay Voltooid',
      orionDossier: dossier,
      hermesResult: result
    });

  } catch (error: any) {
    console.error('[SWARM RELAY ERROR]', error);
    return new NextResponse(`Swarm Relay Error: ${error.message}`, { status: 500 });
  }
}
