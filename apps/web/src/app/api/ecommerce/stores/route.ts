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
