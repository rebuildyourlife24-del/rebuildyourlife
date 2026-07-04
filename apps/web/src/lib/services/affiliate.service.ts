import { prisma } from '@rebuildyourlife/database';

export class AffiliateService {
  /**
   * Registers a click for a specific affiliate code.
   */
  static async registerClick(affiliateCode: string, ipAddress?: string, userAgent?: string) {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { affiliateCode }
    });

    if (!affiliate) return null;

    return prisma.affiliateClick.create({
      data: {
        affiliateProfileId: affiliate.id,
        ipAddress,
        userAgent
      }
    });
  }

  /**
   * Processes a successful sale (e.g. Elite Package) and distributes Tier 1 and Tier 2 commissions.
   */
  static async processSalePayout(
    purchaserUserId: string, 
    molliePaymentId: string, 
    amountPaid: number, 
    tier1AffiliateCode?: string
  ) {
    if (!tier1AffiliateCode) return null;

    // Zoek de directe verkoper (Tier 1)
    const tier1Affiliate = await prisma.affiliateProfile.findUnique({
      where: { affiliateCode: tier1AffiliateCode },
      include: { parentAffiliate: true } // Haal ook de sponsor (Tier 2) op
    });

    if (!tier1Affiliate) return null;

    // Bepaal de commissies (vast bedrag of percentage)
    const tier1Commission = amountPaid >= 2000 ? 500 : (amountPaid * (tier1Affiliate.commissionRate / 100));
    
    // Tier 2 (Netwerk Bonus) is alleen van toepassing bij high-ticket sales (bv. Elite) of kan standaard zijn
    const tier2Commission = amountPaid >= 2000 && tier1Affiliate.parentAffiliate ? 100 : 0;
    const tier2AffiliateProfileId = tier2Commission > 0 ? tier1Affiliate.parentAffiliateId : null;

    // Registreer de sale in de database
    const sale = await prisma.affiliateSale.create({
      data: {
        affiliateProfileId: tier1Affiliate.id,
        tier2AffiliateProfileId,
        purchaserUserId,
        molliePaymentId,
        amount: amountPaid,
        commission: tier1Commission,
        tier2Commission,
        status: 'PAID' // Direct paid since this is called after successful Mollie webhook
      }
    });

    // Update de balansen van de affiliates
    // 1. Directe verkoper (Tier 1)
    await prisma.affiliateProfile.update({
      where: { id: tier1Affiliate.id },
      data: {
        totalEarned: { increment: tier1Commission },
        pendingBalance: { increment: tier1Commission }
      }
    });

    // 2. Netwerk sponsor (Tier 2)
    if (tier2AffiliateProfileId && tier2Commission > 0) {
      await prisma.affiliateProfile.update({
        where: { id: tier2AffiliateProfileId },
        data: {
          totalEarned: { increment: tier2Commission },
          pendingBalance: { increment: tier2Commission }
        }
      });
    }

    return sale;
  }
}
