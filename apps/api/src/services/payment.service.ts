import { createMollieClient } from "@mollie/api-client";
import { prisma } from "@rebuildyourlife/database";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";

const mollieClient = createMollieClient({ apiKey: env.MOLLIE_API_KEY });

export class PaymentService {
  static async createCheckoutSession(userId: string, plan: string) {
    const validPlans = ["PREMIUM", "ENTERPRISE"];
    if (!validPlans.includes(plan)) {
      throw new AppError("Invalid plan selected", 400, "INVALID_PLAN");
    }

    const amount = plan === "PREMIUM" ? "14.95" : "49.95";

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
  }

  static async handleWebhook(paymentId: string) {
    const payment = await mollieClient.payments.get(paymentId);
    if (!payment.metadata || !payment.metadata.userId || !payment.metadata.plan) {
      return;
    }

    const { userId, plan } = payment.metadata as any;

    if (payment.isPaid()) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: plan,
          subscriptionStatus: "ACTIVE",
        },
      });
    } else if (payment.isCanceled() || payment.isExpired() || payment.isFailed()) {
      // Optional: Handle failure (e.g. log it)
    }
  }
}
