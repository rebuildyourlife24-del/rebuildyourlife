import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Gebruik een globale Prisma instantie in dev, anders wordt de database overspoeld
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(req: Request) {
  try {
    // 1. Vercel Cron Security Check
    // Zorg ervoor dat alleen Vercel dit kan aanroepen via de Authorization header.
    const authHeader = req.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Registreer de Heartbeat in Supabase
    await prisma.systemHealthLog.create({
      data: {
        component: 'SYSTEM_HEARTBEAT',
        status: 'ONLINE',
        latencyMs: 0,
        actionTaken: 'Cron Job executed successfully',
      },
    });

    // 3. (Toekomstige logica): Check op AgentActions of AIMemories die verwerkt moeten worden
    // Hier kan de AI later automatisch nieuwsbrieven genereren, e-mails sturen, etc.

    console.log('[HEARTBEAT] System is alive and beating.');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sovereign Heartbeat registered successfully' 
    });
    
  } catch (error: any) {
    console.error('[HEARTBEAT ERROR]', error);
    
    // Probeer de fout te loggen in de database
    try {
      await prisma.systemHealthLog.create({
        data: {
          component: 'SYSTEM_HEARTBEAT',
          status: 'ERROR',
          errorLog: error.message,
        },
      });
    } catch (e) {
      // Ignore if DB is completely unreachable
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
