import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionAction();
    if (!session.success || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'SUPREME_OVERSEER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (body.status === undefined) {
      return NextResponse.json({ error: 'Status is vereist' }, { status: 400 });
    }

    const updatedFranchise = await prisma.franchise.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updatedFranchise);
  } catch (error: any) {
    console.error("Admin franchise update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
