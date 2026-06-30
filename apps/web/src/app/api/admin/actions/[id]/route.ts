import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { executePendingActions } from '@/lib/agents/executor';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    
    if (!status || !['APPROVED', 'DENIED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await db.agentAction.update({
      where: { id: params.id },
      data: { status }
    });

    // If approved, instantly trigger the executor in the background
    if (status === 'APPROVED') {
      // Run asynchronously without blocking the response
      executePendingActions().catch(console.error);
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}