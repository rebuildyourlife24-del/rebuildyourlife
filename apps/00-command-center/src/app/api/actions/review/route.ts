import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function GET() {
  try {
    const actions = await prisma.agentAction.findMany({
      where: { status: 'PENDING' },
      orderBy: { suggestedAt: 'desc' },
      take: 20
    });
    return NextResponse.json(actions);
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json({ error: 'Failed to load actions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { actionId, status } = await req.json();
    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedAction = await prisma.agentAction.update({
      where: { id: actionId },
      data: {
        status,
        reviewedAt: new Date(),
      }
    });

    return NextResponse.json(updatedAction);
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }
}
