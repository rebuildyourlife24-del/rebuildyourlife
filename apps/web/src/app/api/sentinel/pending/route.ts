import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Haal de Hypothesen op
    const hypotheses = await db.agentKnowledgeBase.findMany({
      where: { type: "HYPOTHESIS" },
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: {
        agent: {
          select: { name: true, role: true }
        }
      }
    });

    // 2. Haal de Shopify Products op (DRAFT)
    const shopifyProducts = await db.shopifyProduct.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 3. Haal de E-mailcampagnes op (DRAFT)
    const emailCampaigns = await db.emailCampaign.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 4. Haal de Video Scripts op (DRAFT)
    const marketingVideos = await db.marketingVideo.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        hypotheses,
        shopifyProducts,
        emailCampaigns,
        marketingVideos
      }
    });
  } catch (error: any) {
    console.error('[SENTINEL API] Fout bij ophalen pending items:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
