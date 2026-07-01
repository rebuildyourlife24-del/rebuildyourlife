import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

export async function GET() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'SUPREME_OVERSEER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalUsers = await prisma.user.count();
    const activeFranchises = await prisma.franchise.count({ where: { status: 'ACTIVE' } });
    
    // Sum of all Platform cuts (Mock calculation or real sum from WalletTransaction where type='PLATFORM_FEE')
    const feeTransactions = await prisma.walletTransaction.aggregate({
      where: { type: 'PLATFORM_FEE', status: 'COMPLETED' },
      _sum: { amount: true }
    });

    const platformCutsRevenue = feeTransactions._sum.amount || 0;

    return NextResponse.json({ totalUsers, activeFranchises, platformCutsRevenue });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
