import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

// Prevent edge runtime for heavy DB operations
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow 5 mins for this heavy scan

export async function GET(req: Request) {
  try {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    // Only allow Vercel Cron OR valid manual trigger with CRON_SECRET
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Return 401 Unauthorized if not authenticated
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // We will bind all agent actions to the primary admin/CEO user.
    // For now, fetch the main user (or you could iterate all users for SaaS)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      return NextResponse.json({ error: 'No admin user found to assign actions to.' }, { status: 400 });
    }

    const userId = adminUser.id;
    const actionsGenerated = [];

    // --- MODULE 1: B2B SYNDICATE OUTREACH ---
    const untamperedLeads = await prisma.businessClient.count({
      where: { status: 'NEW' }
    });

    if (untamperedLeads > 0) {
      const action = await prisma.agentAction.create({
        data: {
          userId,
          agentType: 'ORION',
          title: 'B2B Syndicate Outreach Batch',
          description: `Er staan ${untamperedLeads} onbewerkte B2B leads klaar in de database.`,
          estimatedCost: untamperedLeads * 0.10, // SMTP costs
          estimatedRevenue: untamperedLeads * 50, 
          riskLevel: 'MEDIUM',
          reasoningApprove: `Dit zet de geautomatiseerde e-mail sequence in werking voor ${untamperedLeads} leads. Dit is pure warme acquisitie.`,
          reasoningDeny: 'Leads verouderen in de database als we ze niet opvolgen.'
        }
      });
      actionsGenerated.push(action.id);
    }

    // --- MODULE 2: FIRST-PARTY DATA RETARGETING ---
    const hotProfiles = await prisma.firstPartyDataProfile.findMany({
      where: { intentScore: { gt: 75 } }
    });

    if (hotProfiles.length > 0) {
      const action = await prisma.agentAction.create({
        data: {
          userId,
          agentType: 'HERMES',
          title: 'FPD Retargeting Protocol',
          description: `Er zijn ${hotProfiles.length} actieve gebruikers met aankoopintentie >75%.`,
          estimatedCost: 20, // Baseline retargeting budget injection
          estimatedRevenue: hotProfiles.length * 45, 
          riskLevel: 'LOW',
          reasoningApprove: `Gebaseerd op de live intent-score van ${hotProfiles.length} gebruikers. Een gerichte push via Meta API garandeert bijna conversie.`,
          reasoningDeny: 'We laten ' + (hotProfiles.length * 45) + ' euro aan verwachte omzet liggen.'
        }
      });
      actionsGenerated.push(action.id);
    }

    // --- MODULE 3: FINANCIAL RE-INVESTMENT LOOP ---
    // Calculate deposits from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const deposits = await prisma.platformCreditTransaction.aggregate({
      _sum: { amount: true },
      where: {
        type: 'DEPOSIT',
        status: 'COMPLETED',
        createdAt: { gte: yesterday }
      }
    });

    const recentRevenue = deposits._sum.amount || 0;
    
    if (recentRevenue > 100) {
      // Suggest 30% reinvestment
      const reinvestAmount = Math.round(recentRevenue * 0.30);
      const action = await prisma.agentAction.create({
        data: {
          userId,
          agentType: 'FINANCE',
          title: 'Winst Herinvestering',
          description: `Er is de afgelopen 24u €${recentRevenue} aan omzet gedraaid.`,
          estimatedCost: reinvestAmount,
          estimatedRevenue: reinvestAmount * 3, // Assuming 3.0 ROAS
          riskLevel: 'LOW',
          reasoningApprove: `Sneeuwbal-effect: Door direct 30% (€${reinvestAmount}) terug te stoppen in de ads schalen we exponentieel op.`,
          reasoningDeny: 'Groei stagneert doordat we het advertentiebudget niet verhogen bij succes.'
        }
      });
      actionsGenerated.push(action.id);
    }

    // --- MODULE 4: SUPPLY CHAIN SCAN ---
    const lowStockProducts = await prisma.supplierProduct.findMany({
      where: { stock: { lt: 50 } },
      include: { supplier: true }
    });

    if (lowStockProducts.length > 0) {
      const action = await prisma.agentAction.create({
        data: {
          userId,
          agentType: 'LOGISTICS',
          title: 'Kritieke Voorraad Inkoop',
          description: `Er zijn ${lowStockProducts.length} producten met kritieke voorraad (< 50).`,
          estimatedCost: lowStockProducts.reduce((acc, p) => acc + (p.costPrice * 100), 0), // Order 100 units each
          estimatedRevenue: lowStockProducts.reduce((acc, p) => acc + ((p.suggestedRetailPrice || (p.costPrice*2)) * 100), 0),
          riskLevel: 'MEDIUM',
          reasoningApprove: `Dit voorkomt dat best-sellers 'Out of Stock' gaan, wat funest is voor de ad algoritmes.`,
          reasoningDeny: 'Campagnes zullen vastlopen en leads zullen weglopen omdat producten onbestelbaar worden.'
        }
      });
      actionsGenerated.push(action.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Omnibus scan completed',
      actionsGenerated: actionsGenerated.length
    });

  } catch (error: any) {
    console.error('Omnibus Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
