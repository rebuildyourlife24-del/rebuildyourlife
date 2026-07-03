import { NextResponse } from 'next/server';

// Dit is de API Endpoint voor Verdienmodel 10: The Syndicate
// Verwerkt een nieuwe Elite verkoop en splitst de commissie ($500) over de upline

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buyerEmail, referralCode, amount = 2000 } = body;

    if (!referralCode) {
      return NextResponse.json({ success: false, error: 'Referral code ontbreekt' }, { status: 400 });
    }

    console.log(`[SYNDICATE API] Nieuwe verkoop binnengekomen: €${amount} via link: ${referralCode}`);

    // In een echte productie-omgeving halen we dit uit Prisma:
    // const subSeller = await prisma.syndicateNetwork.findUnique({ where: { referralCode } });
    // const agreement = await prisma.commissionAgreement.findFirst({ where: { subUserId: subSeller.userId } });

    // --- MOCK DATABASE QUERY VOOR DE TEST ---
    const mockDatabase = {
      subSellerId: "USER_SUB_001",
      parentSellerId: "USER_PARENT_001",
      affiliatePoolAmount: 500,
      parentSplitPercentage: 40, // De hoofdverkoper krijgt 40% van de 500
      subSplitPercentage: 60,    // De sub-verkoper krijgt 60% van de 500
    };
    // ----------------------------------------

    // 1. Bereken de bedragen
    const supremeOverseerAmount = amount - mockDatabase.affiliatePoolAmount;
    const parentAmount = (mockDatabase.affiliatePoolAmount * mockDatabase.parentSplitPercentage) / 100;
    const subAmount = (mockDatabase.affiliatePoolAmount * mockDatabase.subSplitPercentage) / 100;

    // 2. Transacties wegschrijven (Prisma)
    // await prisma.transaction.create({ data: { userId: mockDatabase.subSellerId, amount: subAmount } })
    // await prisma.transaction.create({ data: { userId: mockDatabase.parentSellerId, amount: parentAmount } })

    // 3. API Response
    const result = {
      total_commission: amount,
      payouts: {
        sub_seller: {
          id: mockDatabase.subSellerId,
          percentage: mockDatabase.subSplitPercentage,
          amount_earned: subAmount
        },
        parent_seller: {
          id: mockDatabase.parentSellerId,
          percentage: mockDatabase.parentSplitPercentage,
          amount_earned: parentAmount
        }
      },
      status: "SPLIT_SUCCESSFUL",
      timestamp: new Date().toISOString()
    };

    console.log("[SYNDICATE API] Commissie succesvol gesplitst:", result);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error("[Syndicate API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
