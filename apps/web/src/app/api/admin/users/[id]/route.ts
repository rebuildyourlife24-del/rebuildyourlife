import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'SUPREME_OVERSEER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const allowedUpdates = ['subscriptionTier', 'role', 'clearanceLevel'];
    const updateData: any = {};

    allowedUpdates.forEach(key => {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Geen geldige velden om te updaten' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
