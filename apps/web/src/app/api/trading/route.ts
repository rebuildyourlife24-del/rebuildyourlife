import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { BybitService } from '@/lib/services/bybit.service';

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

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Haal de bot op voor deze gebruiker
    let bot = await prisma.tradingBot.findUnique({
      where: { userId: user.id },
      include: {
        trades: {
          orderBy: { openedAt: 'desc' },
          take: 50,
        },
      },
    });

    // Als de bot nog niet bestaat, maak er direct een aan
    if (!bot) {
      bot = await prisma.tradingBot.create({
        data: {
          userId: user.id,
          exchange: 'BYBIT_TESTNET', // Standaard sandbox voor veiligheid
          status: 'IDLE',
          mode: 'CONSERVATIVE',
          allocatedFunds: 10000.0,
          currentPnl: 0.0,
        },
        include: {
          trades: true,
        },
      });
    }

    // Echte API integratie: haal live Bybit saldo op als de sleutels er zijn
    let liveError = null;
    if (bot.apiKey && bot.apiSecret && (bot.exchange === 'BYBIT' || bot.exchange === 'BYBIT_TESTNET')) {
      const isTestnet = bot.exchange === 'BYBIT_TESTNET';
      const balanceResult = await BybitService.getWalletBalance(bot.apiKey, bot.apiSecret, isTestnet);
      
      if (!balanceResult.error) {
        // Synchroniseer met de database
        bot = await prisma.tradingBot.update({
          where: { id: bot.id },
          data: {
            allocatedFunds: balanceResult.balance,
          },
          include: {
            trades: {
              orderBy: { openedAt: 'desc' },
              take: 50,
            },
          },
        });
      } else {
        liveError = balanceResult.error;
      }
    }

    // Performance Fee logica & Overzicht voor Henk (Supreme Overseer)
    let systemStats = null;
    const isSupremeOverseer = user.role === 'SUPREME_OVERSEER' || user.email === 'ceo@rebuildyourlife.com';

    if (isSupremeOverseer) {
      const allBots = await prisma.tradingBot.findMany({
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      const totalAllocated = allBots.reduce((sum, b) => sum + b.allocatedFunds, 0);
      const totalPnl = allBots.reduce((sum, b) => sum + b.currentPnl, 0);
      const activeBotsCount = allBots.filter(b => b.status === 'TRADING').length;

      const henkBot = allBots.find(b => b.userId === user.id);
      let totalFeesEarned = 0;
      if (henkBot) {
        const feeRecords = await prisma.tradeRecord.findMany({
          where: {
            botId: henkBot.id,
            symbol: { startsWith: 'PERF_FEE' },
          },
        });
        totalFeesEarned = feeRecords.reduce((sum, r) => sum + r.pnlAmount, 0);
      }

      systemStats = {
        totalAllocatedFunds: totalAllocated,
        totalSystemPnl: totalPnl,
        activeBots: activeBotsCount,
        totalBots: allBots.length,
        totalFeesEarned: totalFeesEarned,
        botsList: allBots.map(b => ({
          botId: b.id,
          userName: `${b.user.firstName || ''} ${b.user.lastName || ''}`.trim() || b.user.email,
          email: b.user.email,
          exchange: b.exchange,
          status: b.status,
          mode: b.mode,
          allocatedFunds: b.allocatedFunds,
          currentPnl: b.currentPnl,
        })),
      };
    }

    return NextResponse.json({
      bot,
      isSupremeOverseer,
      systemStats,
      liveError,
    });
  } catch (error) {
    console.error('Error fetching trading bot data:', error);
    return NextResponse.json({ error: 'Failed to fetch trading bot data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { exchange, apiKey, apiSecret, allocatedFunds, mode } = body;

    // Valideer parameters
    if (exchange && !['BINANCE', 'BYBIT', 'BYBIT_TESTNET', 'KRAKEN'].includes(exchange)) {
      return NextResponse.json({ error: 'Invalid exchange' }, { status: 400 });
    }
    if (mode && !['CONSERVATIVE', 'APEX_AGGRESSIVE'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }
    const funds = allocatedFunds !== undefined ? parseFloat(allocatedFunds) : undefined;
    if (funds !== undefined && (isNaN(funds) || funds < 0)) {
      return NextResponse.json({ error: 'Invalid allocated funds' }, { status: 400 });
    }

    const existingBot = await prisma.tradingBot.findUnique({
      where: { userId: user.id },
    });

    let updatedBot;

    if (existingBot) {
      updatedBot = await prisma.tradingBot.update({
        where: { userId: user.id },
        data: {
          exchange: exchange ?? existingBot.exchange,
          apiKey: apiKey !== undefined ? apiKey : existingBot.apiKey,
          apiSecret: apiSecret !== undefined ? apiSecret : existingBot.apiSecret,
          allocatedFunds: funds ?? existingBot.allocatedFunds,
          mode: mode ?? existingBot.mode,
        },
        include: {
          trades: {
            orderBy: { openedAt: 'desc' },
            take: 50,
          },
        },
      });
    } else {
      updatedBot = await prisma.tradingBot.create({
        data: {
          userId: user.id,
          exchange: exchange ?? 'BYBIT_TESTNET',
          apiKey: apiKey ?? null,
          apiSecret: apiSecret ?? null,
          allocatedFunds: funds ?? 10000,
          mode: mode ?? 'CONSERVATIVE',
          status: 'IDLE',
          currentPnl: 0,
        },
        include: {
          trades: true,
        },
      });
    }

    return NextResponse.json({ success: true, bot: updatedBot });
  } catch (error) {
    console.error('Error updating trading bot configuration:', error);
    return NextResponse.json({ error: 'Failed to configure trading bot' }, { status: 500 });
  }
}
