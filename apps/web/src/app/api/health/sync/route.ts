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

    // Gesimuleerde Oura Ring / Apple Health Sync API Response
    const mockSyncData = {
      steps: Math.floor(Math.random() * 5000) + 5000,
      sleepScore: (Math.random() * 3 + 6).toFixed(1), // 6.0 to 9.0
      weightKg: 78.5,
      waterMl: 1500,
      workoutMinutes: Math.floor(Math.random() * 60) + 15,
      workoutType: Math.random() > 0.5 ? 'Gym' : 'Hardlopen',
    };

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
        steps: mockSyncData.steps,
        sleepScore: parseFloat(mockSyncData.sleepScore),
      },
      create: {
        userId,
        date: today,
        steps: mockSyncData.steps,
        sleepScore: parseFloat(mockSyncData.sleepScore),
        weightKg: mockSyncData.weightKg,
        waterMl: mockSyncData.waterMl,
        workoutMinutes: mockSyncData.workoutMinutes,
        workoutType: mockSyncData.workoutType,
      }
    });

    return NextResponse.json({ success: true, message: 'Wearable data gesynchroniseerd', log });
  } catch (error: any) {
    console.error('[HEALTH SYNC ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
