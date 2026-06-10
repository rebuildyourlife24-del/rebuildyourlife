import { NextResponse } from 'next/server';
import { PrismaClient } from '@rebuildyourlife/database';

// Global prisma instance for Next.js in dev mode to prevent connection exhaustion
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    // Haal de Opperbaas op (we zoeken naar de SUPREME_OVERSEER rol)
    const overseer = await prisma.user.findFirst({
      where: { role: 'SUPREME_OVERSEER' },
    });

    if (!overseer) {
      return NextResponse.json({ error: "Supreme Overseer profiel niet gevonden. Voer het seed script uit." }, { status: 404 });
    }

    // In een echte productie omgeving halen we hier de som van alle Stripe facturen op.
    // Voor dit God-Mode dashboard halen we de test metrics op of genereren we de actuele status gebaseerd op de database.
    // Omdat de tabellen nu leeg zijn (behalve de admin), simuleren we even de God-Mode cashflow op basis van het Opperbaas profiel.
    
    // Bereken het Safety-Net (64% netto, 21% btw, 15% buffer)
    const grossIncome = 30275; 
    const netProfit = grossIncome * 0.64;
    const vat = grossIncome * 0.21;
    const buffer = grossIncome * 0.15;

    return NextResponse.json({
      status: 'ok',
      overseer: {
        name: `${overseer.firstName} ${overseer.lastName}`,
        email: overseer.email,
        role: overseer.role
      },
      financials: {
        grossIncome,
        netProfit,
        vat,
        buffer,
      }
    });
  } catch (error) {
    console.error("Fout bij ophalen CEO Metrics:", error);
    return NextResponse.json({ error: "Database verbinding gefaald." }, { status: 500 });
  }
}
