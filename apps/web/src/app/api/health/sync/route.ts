import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    let userId = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET! || 'secret') as any;
        userId = decoded.userId;
      } catch {}
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Require real data from request body (No Mocking)
    const body = await req.json();
    const { steps, sleepScore, weightKg, waterMl, workoutMinutes, workoutType } = body;

    if (steps === undefined && sleepScore === undefined) {
      return NextResponse.json({ error: 'No health data provided in request body.' }, { status: 400 });
    }

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
        ...(steps !== undefined && { steps: parseInt(steps) }),
        ...(sleepScore !== undefined && { sleepScore: parseFloat(sleepScore) }),
        ...(weightKg !== undefined && { weightKg: parseFloat(weightKg) }),
        ...(waterMl !== undefined && { waterMl: parseInt(waterMl) }),
        ...(workoutMinutes !== undefined && { workoutMinutes: parseInt(workoutMinutes) }),
        ...(workoutType !== undefined && { workoutType })
      },
      create: {
        userId,
        date: today,
        steps: steps ? parseInt(steps) : null,
        sleepScore: sleepScore ? parseFloat(sleepScore) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        waterMl: waterMl ? parseInt(waterMl) : null,
        workoutMinutes: workoutMinutes ? parseInt(workoutMinutes) : null,
        workoutType: workoutType || null,
      }
    });

    return NextResponse.json({ success: true, message: 'Wearable data gesynchroniseerd', log });
  } catch (error: any) {
    console.error('[HEALTH SYNC ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
