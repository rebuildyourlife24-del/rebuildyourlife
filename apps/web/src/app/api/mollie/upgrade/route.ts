import { NextResponse } from "next/server";
import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Simpele redirect/mock logic. In een echte Mollie setup maak je hier een Payment link aan.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get('plan');
    
    if (!plan || !['business', 'elite'].includes(plan)) {
      return NextResponse.redirect(new URL('/dashboard/billing', req.url));
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // HIER KOMT DE MOLLIE CREATE PAYMENT LOGICA
    // const payment = await mollieClient.payments.create({ ... });
    // redirectUrl: `https://.../dashboard/billing?success=true`

    // Voor nu (Mocking success flow)
    await prisma.user.update({
      where: { id: userId },
      data: {
        // Zodra het role systeem er is, upgrade je het hier. 
        // Bijv. role: plan === 'elite' ? 'ELITE' : 'BUSINESS'
      }
    });

    // Simulatie van een Mollie Checkout Link, we redirecten direct terug voor de demo
    return NextResponse.redirect(new URL('/dashboard/billing?success=true', req.url));

  } catch (error) {
    console.error("Upgrade Error:", error);
    return NextResponse.redirect(new URL('/dashboard/billing?error=true', req.url));
  }
}
