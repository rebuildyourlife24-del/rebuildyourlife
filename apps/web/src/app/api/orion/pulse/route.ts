import { NextResponse } from 'next/server';
import { OmegaProtocol } from '@/lib/orion/omega-core';

// Deze route kan door Vercel Cron Jobs of externe pings elke minuut worden aangeroepen
export async function GET() {
  try {
    const status = await OmegaProtocol.pulse();
    return NextResponse.json(status);
  } catch (error) {
    console.error('[ORION CORE ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to execute Orion Pulse' },
      { status: 500 }
    );
  }
}
