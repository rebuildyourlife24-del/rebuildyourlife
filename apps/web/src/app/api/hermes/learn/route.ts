import { NextResponse } from 'next/server';
import { executeHermesAutonomousCycle } from '@/lib/hermes/autonomous-loop';

export const maxDuration = 300; // Allow 5 mins for AI to think

// ══════════════════════════════════════════════════════════════
// HERMES 2.0 LEARNING ENGINE (Cron/Trigger endpoint)
// ══════════════════════════════════════════════════════════════

export async function POST(req: Request) {
  try {
    // Beveiliging: In productie wil je hier controleren of het verzoek van een Vercel Cron komt
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('[HERMES API] Ontvangen trigger voor autonome denkslag...');
    
    // Start de autonome cyclus
    const result = await executeHermesAutonomousCycle();

    return NextResponse.json(result);

  } catch (err: any) {
    console.error('[HERMES API] Fout tijdens autonome cyclus:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
