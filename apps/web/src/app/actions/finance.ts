"use server";

import { prisma } from "@rebuildyourlife/database";
import { getSessionAction } from "./auth";

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const session = await getSessionAction();
    if (session.success && session.user) {
      return session.user.id;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Gets real aggregated revenue data from the database.
 * We group WalletTransactions by their "type" (which represents the industry: ECOM, SAAS, AGENCY)
 * and by week of creation.
 */
export async function getHoldingRevenueAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, data: [] };

  try {
    // Haal alle "COMPLETED" inkomsten transacties op van de laatste 6 weken
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

    const transactions = await prisma.walletTransaction.findMany({
      where: {
        userId,
        status: "COMPLETED",
        amount: { gt: 0 },
        createdAt: { gte: sixWeeksAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    // We groeperen ze per "Week 1", "Week 2" etc op basis van de datum.
    const weeklyData: Record<string, any> = {
      "Week 1": { name: "Week 1", ecom: 0, saas: 0, agency: 0 },
      "Week 2": { name: "Week 2", ecom: 0, saas: 0, agency: 0 },
      "Week 3": { name: "Week 3", ecom: 0, saas: 0, agency: 0 },
      "Week 4": { name: "Week 4", ecom: 0, saas: 0, agency: 0 },
      "Week 5": { name: "Week 5", ecom: 0, saas: 0, agency: 0 },
      "Week 6": { name: "Week 6", ecom: 0, saas: 0, agency: 0 },
    };

    transactions.forEach(tx => {
      // Bepaal in welke week de transactie valt (1 tot 6) ten opzichte van sixWeeksAgo
      const diffTime = Math.abs(tx.createdAt.getTime() - sixWeeksAgo.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekNum = Math.min(6, Math.max(1, Math.ceil(diffDays / 7)));
      
      const weekKey = `Week ${weekNum}`;
      
      const type = tx.type.toUpperCase();
      let key = "ecom";
      if (type.includes("SAAS")) key = "saas";
      if (type.includes("AGENCY") || type.includes("SMMA")) key = "agency";
      
      if (weeklyData[weekKey]) {
        weeklyData[weekKey][key] += tx.amount;
      }
    });

    const result = Object.values(weeklyData);

    return { success: true, data: result };

  } catch (error) {
    console.error("getHoldingRevenueAction error:", error);
    return { success: false, data: [] };
  }
}

/**
 * Seeding script om test-transacties in te spoelen zodat de grafiek niet 0 is,
 * totdat er echte Mollie transacties binnenkomen.
 */
export async function seedTestFinanceDataAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Niet ingelogd" };

  try {
    // Check of er al data is om duplicaten te voorkomen
    const existing = await prisma.walletTransaction.count({
      where: { userId, status: "COMPLETED" }
    });

    if (existing > 0) {
      return { success: true, message: "Data was al gesynct met de test-netwerken." };
    }

    const newTransactions = [];
    const now = new Date();

    // Genereer transacties voor de afgelopen 6 weken
    for (let i = 0; i < 42; i++) {
      const txDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Willekeurige Ecom Sale
      newTransactions.push({
        userId,
        amount: Math.floor(Math.random() * 500) + 50,
        type: "ECOM_SALE",
        executedBy: "Mollie",
        status: "COMPLETED",
        description: "Shopify Bestelling",
        createdAt: txDate
      });

      // Willekeurige SaaS abonnement
      if (i % 3 === 0) {
        newTransactions.push({
          userId,
          amount: 49.99,
          type: "SAAS_SUBSCRIPTION",
          executedBy: "Stripe",
          status: "COMPLETED",
          description: "RYL SaaS Abbo",
          createdAt: txDate
        });
      }

      // Willekeurige Agency Retainer (minder vaak)
      if (i % 14 === 0) {
        newTransactions.push({
          userId,
          amount: 1500,
          type: "AGENCY_RETAINER",
          executedBy: "Bank Transfer",
          status: "COMPLETED",
          description: "SMMA Klant",
          createdAt: txDate
        });
      }
    }

    await prisma.walletTransaction.createMany({
      data: newTransactions
    });

    return { success: true, message: "Database is succesvol voorzien van live-test data." };
  } catch (error) {
    console.error("seedTestFinanceDataAction error:", error);
    return { success: false, error: "Failed to seed data" };
  }
}
