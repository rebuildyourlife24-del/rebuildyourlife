import { NextResponse } from 'next/server';
import { SupremeOrchestratorService } from '@/lib/services/supreme-orchestrator.service';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[GODBRAIN CRON] Heartbeat received. Booting Supreme Orchestrator...');
    
    // De Supreme Orchestrator vuurt nu alle onderliggende AI's en integraties 
    // (Orion, Hermes, Shopify, Syndicate) gesynchroniseerd af in de juiste volgorde.
    await SupremeOrchestratorService.runGlobalSynchronization();

    return NextResponse.json({ success: true, message: 'Godbrain Supersystem Synchronized' });
  } catch (error: any) {
    console.error('[GODBRAIN CRON] Critical Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
