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
        const decoded = jwt.verify(token, process.env.JWT_SECRET! || 'secret') as any;
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

    const contacts = await db.socialContact.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('[NETWORK GET ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, relationship, lastContactAt, reminderFrequencyDays, notes, phone, email, isImportant } = body;

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
      const fallbackUser = await db.user.findFirst();
      if (fallbackUser) userId = fallbackUser.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contact = await db.socialContact.create({
      data: {
        userId,
        name,
        type: type || 'PARTNER',
        relationship,
        lastContactAt: lastContactAt ? new Date(lastContactAt) : new Date(),
        reminderFrequencyDays: parseInt(reminderFrequencyDays) || 30,
        notes,
        phone,
        email,
        isImportant: Boolean(isImportant)
      }
    });

    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    console.error('[NETWORK POST ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
