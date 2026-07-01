import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

export async function GET() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'SUPREME_OVERSEER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        clearanceLevel: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to 100 recent users for performance
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
