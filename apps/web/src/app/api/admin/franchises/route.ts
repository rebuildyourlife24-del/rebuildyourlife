import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

export async function GET() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'SUPREME_OVERSEER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const franchises = await prisma.franchise.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(franchises);
  } catch (error: any) {
    console.error("Admin franchises error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
