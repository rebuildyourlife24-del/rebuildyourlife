import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const clients = await prisma.businessClient.findMany({
      where: { userId },
      include: { invoices: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, clients });
  } catch (error) {
    console.error("GET Clients Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { name, email, phone, company, status, notes } = await req.json();

    const client = await prisma.businessClient.create({
      data: {
        userId,
        name,
        email,
        phone,
        company,
        status: status || "PROSPECT",
        notes
      }
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error("POST Client Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
