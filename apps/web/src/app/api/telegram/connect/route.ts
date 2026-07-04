import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || 'RebuildYourLifeBot';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Als de gebruiker al gekoppeld is
    if (user.telegramChatId) {
      return NextResponse.json({ 
        success: true, 
        status: "CONNECTED",
        chatId: user.telegramChatId 
      });
    }

    // Genereer of haal de connect token op
    let connectToken = user.telegramConnectToken;
    if (!connectToken) {
      connectToken = Math.random().toString(36).substring(2, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { telegramConnectToken: connectToken }
      });
    }

    const telegramUrl = `https://t.me/${BOT_USERNAME}?start=connect-${connectToken}`;

    return NextResponse.json({ 
      success: true, 
      status: "PENDING",
      url: telegramUrl,
      token: connectToken
    });

  } catch (error) {
    console.error("Telegram Connect Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Allow user to disconnect
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    await prisma.user.update({
      where: { id: userId },
      data: { telegramChatId: null, telegramConnectToken: null }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
