import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

// Opt into the Next.js edge runtime if desired, or stay on node runtime.
export const maxDuration = 300; // Allows up to 5 minutes on Vercel Pro

export async function GET(request: Request) {
  // Security check: ensure this is only called by Vercel Cron or with a secret
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = [];

  try {
    // 1. Proactive Agent: Waking up The Syndicate via Python Backend
    logs.push("Cron Tick: Waking up The Syndicate AI Backend...");
    
    // In production, this should point to your live FastAPI deployment URL
    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';
    
    try {
      const response = await fetch(`${backendUrl}/api/cron/tick`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }
      
      const backendData = await response.json();
      logs.push(`Syndicate executed successfully. Woke up ${backendData.agents_woken || 0} agents.`);
      if (backendData.actions_proposed) {
        logs.push(`Proposed ${backendData.actions_proposed} new actions for Governance Lock.`);
      }
    } catch (backendError: any) {
      logs.push(`Error connecting to Python Backend: ${backendError.message}`);
      // We don't fail the entire Next.js request, we just log it.
    }

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Cron Agent Tick Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
