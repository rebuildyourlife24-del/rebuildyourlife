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

    const invoices = await prisma.businessInvoice.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error("GET Invoices Error:", error);
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

    const { clientId, amount, description, dueDate } = await req.json();

    // Generate Invoice Nr
    const invoiceCount = await prisma.businessInvoice.count({ where: { userId } });
    const invoiceNr = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(4, '0')}`;

    const invoice = await prisma.businessInvoice.create({
      data: {
        userId,
        clientId,
        invoiceNr,
        description,
        amount: parseFloat(amount),
        status: "DRAFT",
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("POST Invoice Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
