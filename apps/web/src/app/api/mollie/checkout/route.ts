import { NextResponse } from 'next/server';
import { PrismaClient } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

export async function POST(req: Request) {
  try {
    const { priceId, successUrl, cancelUrl } = await req.json();
    console.log("Cancel URL:", cancelUrl);

    const token = (await cookies()).get("ryl_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[OMEGA PROTOCOL] Initiating Mollie Checkout for ${user.email} - Price: ${priceId}`);

    // --- MOCK MOLLIE CHECKOUT ---
    // Here we would call the Mollie API to create a payment or subscription mandate.
    // e.g. mollieClient.payments.create({ amount: { value: '19.95', currency: 'EUR' }, ... })
    
    // For the test environment, redirect immediately to a fake success page
    const mockSuccessUrl = new URL(successUrl);
    mockSuccessUrl.searchParams.set('mollie_session_id', 'tr_mock_omega_mollie_12345');
    
    return NextResponse.json({ url: mockSuccessUrl.toString() });

  } catch (error: any) {
    console.error("Mollie Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
