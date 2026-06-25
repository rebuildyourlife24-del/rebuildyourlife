import { prisma } from "@rebuildyourlife/database";



export class CFOService {
  /**
   * Risk Mitigation Protocol:
   * Orion checks if the requested test budget exceeds the 1% to 2% limit of the liquid Treasury.
   */
  static async validateTestBudget(userId: string, requestedAmount: number): Promise<boolean> {
    const vault = await prisma.treasuryVault.findFirst({
      where: { userId: userId, status: "ACTIVE" }
    });

    if (!vault) {
      // If no vault exists, assume $0 liquid, reject test.
      await this.logCFOAction(userId, "REJECTED_BUDGET", `Requested €${requestedAmount} but no TreasuryVault found. Risk of Ruin is 100%.`);
      return false;
    }

    const maxRisk = vault.balance * 0.02; // Max 2% risk rule

    if (requestedAmount > maxRisk) {
      await this.logCFOAction(userId, "REJECTED_BUDGET", `Requested €${requestedAmount}. Exceeds 2% Risk Cap (€${maxRisk.toFixed(2)}). Capital Preservation Protocol activated.`);
      return false;
    }

    await this.logCFOAction(userId, "APPROVED_BUDGET", `Requested €${requestedAmount} is within safe risk limits (Max: €${maxRisk.toFixed(2)}). Test authorized.`);
    return true;
  }

  /**
   * The Tax Shield:
   * Orion analyzes incoming profit and legally shifts it to tax-free or delayed-tax buckets
   * based on the Belastingdienst (IRS) rules (e.g. FOR, HIR).
   */
  static async optimizeTaxes(userId: string, profitAmount: number) {
    // Simulated Tax Logic:
    // 10% to Pension (FOR)
    // 30% to Reinvestment Reserve (HIR)
    // 60% Liquid Profit
    
    const pensionAllocation = profitAmount * 0.10;
    const reinvestmentAllocation = profitAmount * 0.30;
    const liquidProfit = profitAmount * 0.60;

    await prisma.taxStrategy.createMany({
      data: [
        { userId, potName: "Pensioen (FOR)", allocatedAmount: pensionAllocation, taxAdvantage: pensionAllocation * 0.49 }, // Assuming 49% tax bracket savings
        { userId, potName: "Herinvesteringsreserve (HIR)", allocatedAmount: reinvestmentAllocation, taxAdvantage: reinvestmentAllocation * 0.25 } // 25% Vpb savings
      ]
    });

    // Add remaining to Treasury
    const vault = await prisma.treasuryVault.findFirst({ where: { userId, status: "ACTIVE" }});
    if (vault) {
      await prisma.treasuryVault.update({
        where: { id: vault.id },
        data: { balance: vault.balance + liquidProfit }
      });
    } else {
      await prisma.treasuryVault.create({
        data: { userId, balance: liquidProfit }
      });
    }

    await this.logCFOAction(userId, "TAX_OPTIMIZATION_EXECUTED", `Profit of €${profitAmount} optimized. €${(pensionAllocation + reinvestmentAllocation)} shielded from immediate taxation.`);
    
    return { success: true, shielded: pensionAllocation + reinvestmentAllocation, liquid: liquidProfit };
  }

  private static async logCFOAction(userId: string, action: string, details: string) {
    await prisma.agentDossier.create({
      data: {
        agentType: "CFO_TAX_ATTORNEY",
        action: action,
        details: details,
        userId: userId
      }
    });
  }
}
