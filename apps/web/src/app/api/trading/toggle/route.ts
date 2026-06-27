import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET! ;

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bot = await prisma.tradingBot.findUnique({
      where: { userId: user.id },
    });

    if (!bot) {
      return NextResponse.json({ error: 'No trading bot configured yet' }, { status: 400 });
    }

    const newStatus = bot.status === 'TRADING' ? 'IDLE' : 'TRADING';

    const updatedBot = await prisma.tradingBot.update({
      where: { userId: user.id },
      data: {
        status: newStatus,
      },
      include: {
        trades: {
          orderBy: { openedAt: 'desc' },
          take: 50,
        },
      },
    });

    return NextResponse.json({ success: true, bot: updatedBot });
  } catch (error) {
    console.error('Error toggling bot status:', error);
    return NextResponse.json({ error: 'Failed to toggle bot status' }, { status: 500 });
  }
}
