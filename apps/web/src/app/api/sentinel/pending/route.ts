import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Haal de openstaande actievoorstellen op uit de Vault
    const proposals = await db.actionProposal.findMany({
      where: { status: "PENDING" },
      orderBy: { requestedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: proposals
    });
  } catch (error: any) {
    console.error('[SENTINEL API] Fout bij ophalen pending ActionProposals:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
