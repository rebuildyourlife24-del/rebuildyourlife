import { createMollieClient } from "@mollie/api-client";
import { prisma } from "@rebuildyourlife/database";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";

const _mollieClient = createMollieClient({ apiKey: env.MOLLIE_API_KEY });

export class PaymentService {
  static async createCheckoutSession(userId: string, plan: string) {
    const validPlans = ["PREMIUM", "ENTERPRISE"];
    if (!validPlans.includes(plan)) {
      throw new AppError("Invalid plan selected", 400, "INVALID_PLAN");
    }

    const amount = plan === "PREMIUM" ? "14.95" : "49.95";
    console.log(`Creating checkout for amount: ${amount} using mollieClient:`, !!_mollieClient);

    // HACK: For local development testing without webhooks, we immediately upgrade the user.
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: plan,
        subscriptionStatus: "ACTIVE",
      },
    });

    /*
    // REAL IMPLEMENTATION (Commented out):
    const payment = await mollieClient.payments.create({
      amount: {
        value: amount,
        currency: "EUR",
      },
      description: `RebuildYourLife ${plan} Subscription`,
      redirectUrl: `${env.FRONTEND_URL}/dashboard`,
      webhookUrl: `${env.API_URL}/api/v1/payments/webhook`,
      metadata: {
        userId,
        plan,
      },
    });

    return { checkoutUrl: payment.getCheckoutUrl() };
    */

    return { checkoutUrl: `${env.FRONTEND_URL}/dashboard` };
  }
}
