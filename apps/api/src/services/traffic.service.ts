import { createMollieClient } from "@mollie/api-client";
import { prisma } from "@rebuildyourlife/database";
import { env } from "../config/env.js";

// Initialize Mollie if API key is provided
let mollieClient: any = null;
if (env.MOLLIE_API_KEY) {
  try {
    mollieClient = createMollieClient({ apiKey: env.MOLLIE_API_KEY });
  } catch (e) {
    console.warn("Failed to initialize Mollie client:", e);
  }
}

export interface SimulatedCampaign {
  id: string;
  userId: string;
  campaignName: string;
  platform: string;
  totalViews: number;
  totalImpressions: number;
  status: string;
  mediaPath: string | null;
  budgetCredits: number;
  renderStatus: string;
  renderProgress: number;
  viewsHistory: Array<{ date: string; views: number; impressions: number }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulatedPurchase {
  id: string;
  userId: string;
  amount: number;
  credits: number;
  mollieId: string | null;
  status: string;
  createdAt: Date;
}

// In-memory fallback database for robustness when tables are not migrated
const inMemoryCampaigns = new Map<string, SimulatedCampaign[]>();
const inMemoryPurchases = new Map<string, SimulatedPurchase[]>();
const inMemoryCredits = new Map<string, number>();

// Helper to generate fake views history
function generateViewsHistory(days = 7) {
  const history = [];
  const now = new Date();
  let baseViews = 1200;
  let baseImpressions = 5000;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    // Add random growth
    const multiplier = 1 + Math.random() * 0.4;
    const views = Math.floor(baseViews * multiplier);
    const impressions = Math.floor(baseImpressions * multiplier);
    
    history.push({
      date: dateStr,
      views,
      impressions
    });
    
    // Ramp up stats day by day
    baseViews = views;
    baseImpressions = impressions;
  }
  return history;
}

export class TrafficService {
  // --- CREDITS ---
  static async getUserCredits(userId: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { adCredits: true } as any
      });
      return (user as any)?.adCredits ?? 0;
    } catch (error) {
      console.warn("Database adCredits query failed, falling back to memory:", error);
      if (!inMemoryCredits.has(userId)) {
        inMemoryCredits.set(userId, 500); // Default starting credits for trial/demo
      }
      return inMemoryCredits.get(userId) || 0;
    }
  }

  static async addCredits(userId: string, credits: number): Promise<number> {
    try {
      const current = await this.getUserCredits(userId);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { adCredits: current + credits } as any
      });
      return (updatedUser as any).adCredits;
    } catch (error) {
      console.warn("Database adCredits update failed, using memory:", error);
      const current = inMemoryCredits.get(userId) || 0;
      const updated = current + credits;
      inMemoryCredits.set(userId, updated);
      return updated;
    }
  }

  static async deductCredits(userId: string, credits: number): Promise<boolean> {
    const current = await this.getUserCredits(userId);
    if (current < credits) {
      return false;
    }
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { adCredits: current - credits } as any
      });
      return true;
    } catch (error) {
      console.warn("Database adCredits deduction failed, using memory:", error);
      const updated = current - credits;
      inMemoryCredits.set(userId, updated);
      return true;
    }
  }

  // --- MOLLIE AD-CREDITS CHECKOUT ---
  static async createCreditsCheckout(userId: string, creditAmount: number) {
    const eurAmount = (creditAmount / 10).toFixed(2); // €0.10 per credit (e.g. 500 credits = €50)
    const transactionId = Math.random().toString(36).substring(7);

    // Track purchase record (Pending)
    const purchase: SimulatedPurchase = {
      id: transactionId,
      userId,
      amount: parseFloat(eurAmount),
      credits: creditAmount,
      mollieId: null,
      status: "PENDING",
      createdAt: new Date()
    };

    try {
      await prisma.adCreditPurchase.create({
        data: {
          id: transactionId,
          userId,
          amount: parseFloat(eurAmount),
          credits: creditAmount,
          status: "PENDING"
        }
      });
    } catch (e) {
      console.warn("Could not save purchase in database, storing in-memory:", e);
      const userPurchases = inMemoryPurchases.get(userId) || [];
      userPurchases.push(purchase);
      inMemoryPurchases.set(userId, userPurchases);
    }

    if (mollieClient) {
      try {
        const payment = await mollieClient.payments.create({
          amount: {
            value: eurAmount,
            currency: "EUR",
          },
          description: `PR Traffic & Media Factory: ${creditAmount} Credits`,
          redirectUrl: `${env.FRONTEND_URL}/dashboard/traffic?payment=success&tx=${transactionId}`,
          webhookUrl: `${env.API_URL}/api/v1/payments/webhook`,
          metadata: {
            type: "AD_CREDITS",
            userId,
            credits: creditAmount,
            purchaseId: transactionId
          },
        });

        // Update with Mollie Id
        try {
          await prisma.adCreditPurchase.update({
            where: { id: transactionId },
            data: { mollieId: payment.id }
          });
        } catch (e) {
          purchase.mollieId = payment.id;
        }

        return { checkoutUrl: payment.getCheckoutUrl(), purchaseId: transactionId };
      } catch (err) {
        console.error("Mollie checkout failed, falling back to simulated checkout:", err);
      }
    }

    // Sandbox / Development Simulator Link
    return {
      checkoutUrl: `${env.FRONTEND_URL}/dashboard/traffic?simulate-payment=true&tx=${transactionId}&credits=${creditAmount}`,
      purchaseId: transactionId
    };
  }

  static async completePurchase(purchaseId: string): Promise<SimulatedPurchase | null> {
    // Complete the purchase transaction and credit the user
    let purchase: any = null;
    try {
      purchase = await prisma.adCreditPurchase.findUnique({ where: { id: purchaseId } });
      if (purchase && purchase.status === "PENDING") {
        purchase = await prisma.adCreditPurchase.update({
          where: { id: purchaseId },
          data: { status: "PAID" }
        });
        await this.addCredits(purchase.userId, purchase.credits);
      }
    } catch (e) {
      console.warn("Database completePurchase failed, updating in-memory:", e);
      // Fallback in-memory
      for (const [uid, list] of inMemoryPurchases.entries()) {
        const idx = list.findIndex(p => p.id === purchaseId);
        if (idx !== -1 && list[idx].status === "PENDING") {
          list[idx].status = "PAID";
          purchase = list[idx];
          await this.addCredits(uid, purchase.credits);
          break;
        }
      }
    }
    return purchase;
  }

  // --- CAMPAIGNS ---
  static async getCampaigns(userId: string): Promise<SimulatedCampaign[]> {
    try {
      const dbCampaigns = await (prisma.pRCampaign as any).findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });
      return (dbCampaigns as any[]).map(c => ({
        ...c,
        viewsHistory: typeof c.viewsHistory === "string" ? JSON.parse(c.viewsHistory) : (c.viewsHistory || [])
      })) as any[];
    } catch (error) {
      console.warn("Database campaign query failed, returning in-memory:", error);
      return inMemoryCampaigns.get(userId) || [];
    }
  }

  static async launchCampaign(userId: string, campaignName: string, budgetCredits: number): Promise<SimulatedCampaign> {
    // Deduct credits
    const success = await this.deductCredits(userId, budgetCredits);
    if (!success) {
      throw new Error("Insufficient ad-credits");
    }

    const campaignId = Math.random().toString(36).substring(7);
    const mediaOptions = [
      "/materials/Render_Dubai_Lifestyle_001.mp4",
      "/materials/Render_WallStreet_Hustle_002.mp4",
      "/materials/Render_Crypto_Wealth_003.mp4",
      "/materials/Render_Apex_Aesthetics_004.mp4"
    ];
    const mediaPath = mediaOptions[Math.floor(Math.random() * mediaOptions.length)];

    const campaign: SimulatedCampaign = {
      id: campaignId,
      userId,
      campaignName,
      platform: "TIKTOK",
      totalViews: 0,
      totalImpressions: 0,
      status: "RENDERING",
      mediaPath,
      budgetCredits,
      renderStatus: "RENDERING",
      renderProgress: 0,
      viewsHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save Campaign
    try {
      await prisma.pRCampaign.create({
        data: {
          id: campaignId,
          userId,
          campaignName,
          platform: "TIKTOK",
          totalViews: 0,
          totalImpressions: 0,
          status: "RENDERING",
          mediaPath,
          budgetCredits,
          renderStatus: "RENDERING",
          renderProgress: 0,
          viewsHistory: JSON.stringify([])
        } as any
      });
    } catch (e) {
      console.warn("Could not save campaign to database, storing in-memory:", e);
      const userCampaigns = inMemoryCampaigns.get(userId) || [];
      userCampaigns.unshift(campaign);
      inMemoryCampaigns.set(userId, userCampaigns);
    }

    // Trigger asynchronous render-progression simulation in background
    this.startRenderSimulation(userId, campaignId);

    return campaign;
  }

  private static startRenderSimulation(userId: string, campaignId: string) {
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Render completed, set to ACTIVE and populate views statistics
        const history = generateViewsHistory(7);
        const finalViews = history[history.length - 1].views;
        const finalImpressions = history[history.length - 1].impressions;

        try {
          await prisma.pRCampaign.update({
            where: { id: campaignId },
            data: {
              status: "ACTIVE",
              renderStatus: "COMPLETED",
              renderProgress: 100,
              totalViews: finalViews,
              totalImpressions: finalImpressions,
              viewsHistory: JSON.stringify(history)
            } as any
          });
        } catch (e) {
          // Update in memory
          const userCampaigns = inMemoryCampaigns.get(userId) || [];
          const idx = userCampaigns.findIndex(c => c.id === campaignId);
          if (idx !== -1) {
            userCampaigns[idx].status = "ACTIVE";
            userCampaigns[idx].renderStatus = "COMPLETED";
            userCampaigns[idx].renderProgress = 100;
            userCampaigns[idx].totalViews = finalViews;
            userCampaigns[idx].totalImpressions = finalImpressions;
            userCampaigns[idx].viewsHistory = history;
            userCampaigns[idx].updatedAt = new Date();
          }
        }
      } else {
        // Update rendering progress
        try {
          await prisma.pRCampaign.update({
            where: { id: campaignId },
            data: {
              renderProgress: progress
            } as any
          });
        } catch (e) {
          const userCampaigns = inMemoryCampaigns.get(userId) || [];
          const idx = userCampaigns.findIndex(c => c.id === campaignId);
          if (idx !== -1) {
            userCampaigns[idx].renderProgress = progress;
            userCampaigns[idx].updatedAt = new Date();
          }
        }
      }
    }, 1500); // 1.5 seconds per step, total 7.5 seconds render duration
  }

  // --- MANUAL SIMULATION TRIGGERS FOR DEMO ---
  static async triggerViralBoost(userId: string, campaignId: string): Promise<SimulatedCampaign | null> {
    const boostHistory = generateViewsHistory(10).map(item => ({
      ...item,
      views: Math.floor(item.views * 8.5), // Massive 8.5x view boost!
      impressions: Math.floor(item.impressions * 12) // Massive 12x impressions boost!
    }));

    const finalViews = boostHistory[boostHistory.length - 1].views;
    const finalImpressions = boostHistory[boostHistory.length - 1].impressions;

    try {
      const updated = await prisma.pRCampaign.update({
        where: { id: campaignId },
        data: {
          status: "VIRAL",
          totalViews: finalViews,
          totalImpressions: finalImpressions,
          viewsHistory: JSON.stringify(boostHistory)
        } as any
      });
      return {
        ...updated,
        viewsHistory: boostHistory
      } as any;
    } catch (e) {
      const userCampaigns = inMemoryCampaigns.get(userId) || [];
      const idx = userCampaigns.findIndex(c => c.id === campaignId);
      if (idx !== -1) {
        userCampaigns[idx].status = "VIRAL";
        userCampaigns[idx].totalViews = finalViews;
        userCampaigns[idx].totalImpressions = finalImpressions;
        userCampaigns[idx].viewsHistory = boostHistory;
        userCampaigns[idx].updatedAt = new Date();
        return userCampaigns[idx];
      }
      return null;
    }
  }
}
