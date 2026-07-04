import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { prisma } from '@rebuildyourlife/database';

export async function GET() {
  try {
    const session = await getSessionAction();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stores = await prisma.shopifyStore.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ stores });
  } catch (error: any) {
    console.error("Fetch stores error:", error);
    return NextResponse.json(
      { error: "Failed to load stores" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shopUrl, accessToken } = await req.json();

    if (!shopUrl || !accessToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic URL formatting
    let formattedUrl = shopUrl.trim().toLowerCase();
    if (!formattedUrl.includes('.myshopify.com')) {
      formattedUrl = `${formattedUrl}.myshopify.com`;
    }

    const store = await prisma.shopifyStore.create({
      data: {
        userId: user.id,
        shopUrl: formattedUrl,
        accessToken: accessToken.trim(),
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    console.error("Create store error:", error);
    return NextResponse.json(
      { error: "Failed to connect store" },
      { status: 500 }
    );
  }
}
