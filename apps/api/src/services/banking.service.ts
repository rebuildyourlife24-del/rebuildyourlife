import { PrismaClient } from '@prisma/client';
import { VTLBCalculator, VTLBParameters } from '@rebuildyourlife/shared';

const prisma = new PrismaClient();

export class BankingService {
  /**
   * Mockup of Open Banking API Sync (e.g., Plaid / Tink).
   * Reads a user's recent "transactions" and deduces their monthly income, 
   * housing costs, and health insurance.
   */
  public async syncBankData(userId: string) {
    console.log(`[OMEGA PROTOCOL] Syncing Open Banking Data for ${userId}...`);

    // --- MOCK API CALL TO PLAID/TINK ---
    // In reality, this would fetch 90 days of transactions, categorize them via an LLM,
    // and extract structural income/expenses.
    
    // Hardcoded mock scenario: User earns €2400 net, pays €900 rent, €185 health insurance.
    const mockIncome = 2400.00;
    const mockHousing = 900.00;
    const mockHealth = 185.00;

    // Save this structural snapshot in the database (Analytics or specific fields)
    // We'll update the user's latest budget record with this structural data.
    const budgetMonth = new Date();
    budgetMonth.setDate(1); // First of the month
    budgetMonth.setHours(0, 0, 0, 0);

    await prisma.budget.upsert({
      where: {
        userId_month: {
          userId,
          month: budgetMonth
        }
      },
      update: {
        totalIncome: mockIncome,
        totalExpenses: mockHousing + mockHealth + 500, // +500 for other living expenses
      },
      create: {
        userId,
        month: budgetMonth,
        totalIncome: mockIncome,
        totalExpenses: mockHousing + mockHealth + 500,
        savingsTarget: 0, // Calculated later via VTLB
      }
    });

    return {
      success: true,
      data: {
        netIncome: mockIncome,
        housingCost: mockHousing,
        healthInsuranceCost: mockHealth,
        lastSync: new Date()
      }
    };
  }

  /**
   * Calculates the Beslagvrije Voet (VTLB) and locks down the maximum available
   * budget to pay off debts, legally protecting the rest.
   */
  public async enforceVTLBLock(userId: string) {
    // 1. Sync the latest bank data to get real-time income/expenses
    const syncResult = await this.syncBankData(userId);
    
    // 2. Fetch user profile to determine living situation
    // For this MVP, we default to SINGLE. In a real app, this comes from user profile or tax data.
    const params: VTLBParameters = {
      netIncome: syncResult.data.netIncome,
      livingSituation: 'SINGLE',
      housingCost: syncResult.data.housingCost,
      healthInsuranceCost: syncResult.data.healthInsuranceCost,
      hasChildren: false
    };

    // 3. Run the strict legal calculation
    const vtlbData = VTLBCalculator.calculate(params);

    // 4. Update the Database with the new "Seizable Amount" (Wat we naar schuldeisers kunnen sturen)
    console.log(`[VTLB-LOCK] Secured for ${userId}: VTLB is €${vtlbData.vtlbAmount}. Available for creditors: €${vtlbData.seizableAmount}`);

    // Update the Budget or a specific TreasuryVault to reserve the seizable amount.
    // For now, we'll log it as an Audit action for the AI to pick up.
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'VTLB_LOCK_ENFORCED',
        entityType: 'BANKING',
        newValue: JSON.stringify(vtlbData),
      }
    });

    return vtlbData;
  }
}

export const bankingService = new BankingService();
