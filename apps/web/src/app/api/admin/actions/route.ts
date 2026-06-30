import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const actions = await db.agentAction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json(actions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}