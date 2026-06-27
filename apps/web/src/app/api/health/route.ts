import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        userId = decoded.userId;
      } catch {}
    }
    
    // Fallback for dev environment
    if (!userId) {
      const fallbackUser = await db.user.findFirst();
      if (fallbackUser) userId = fallbackUser.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await db.healthLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error('[HEALTH GET ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { steps, sleepScore, weightKg, waterMl, workoutMinutes, workoutType, notes } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        userId = decoded.userId;
      } catch {}
    }
    
    if (!userId) {
      const fallbackUser = await db.user.findFirst();
      if (fallbackUser) userId = fallbackUser.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Normalize date to midnight UTC to prevent multiple logs per day
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const log = await db.healthLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        steps,
        sleepScore,
        weightKg,
        waterMl,
        workoutMinutes,
        workoutType,
        notes
      },
      create: {
        userId,
        date: today,
        steps,
        sleepScore,
        weightKg,
        waterMl,
        workoutMinutes,
        workoutType,
        notes
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error('[HEALTH POST ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
