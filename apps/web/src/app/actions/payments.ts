"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

async function getAuthenticatedUser() {
  const token = (await cookies()).get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

// Prijzen per plan
const PLAN_CONFIG = {
  PREMIUM: {
    amount: "14.95",
    description: "RebuildYourLife Operator — Maandelijks abonnement",
    tier: "PREMIUM",
  },
  ENTERPRISE: {
    amount: "49.95",
    description: "RebuildYourLife Business — Maandelijks abonnement",
    tier: "ENTERPRISE",
  },
} as const;

type MolliePaymentResponse = {
  id: string;
  status?: string;
  metadata?: {
    userId?: string;
    plan?: 'PREMIUM' | 'ENTERPRISE';
    userEmail?: string;
  };
  _links?: {
    checkout?: {
      href?: string;
    };
  };
};

export async function createMollieCheckoutAction(plan: 'PREMIUM' | 'ENTERPRISE') {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "Niet ingelogd" };

  const mollieKey = process.env.MOLLIE_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rebuildyourlife.eu";
  const planConfig = PLAN_CONFIG[plan];

  if (!mollieKey) {
    // Development mode: simuleer upgrade zonder betaling
    console.log(`[DEV] Simuleer upgrade voor ${user.email} naar ${plan}`);
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionTier: plan },
    });
    return { success: true, redirectUrl: '/dashboard?upgraded=true', devMode: true };
  }

  try {
    // Maak Mollie betaling aan
    const mollieResponse = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mollieKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          currency: "EUR",
          value: planConfig.amount,
        },
        description: planConfig.description,
        redirectUrl: `${appUrl}/api/payments/success?userId=${user.id}&plan=${plan}`,
        webhookUrl: `${appUrl}/api/payments/webhook`,
        metadata: {
          userId: user.id,
          plan,
          userEmail: user.email,
        },
      }),
    });

    const payment = await mollieResponse.json() as MolliePaymentResponse;

    if (!mollieResponse.ok) {
      console.error("Mollie error:", payment);
      return { success: false, error: "Betalingsverwerker kon niet worden bereikt." };
    }

    return {
      success: true,
      redirectUrl: payment._links?.checkout?.href,
      paymentId: payment.id,
    };
  } catch (error) {
    console.error("createMollieCheckoutAction error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het aanmaken van de betaling." };
  }
}

// Webhook handler logica (verwerkt Mollie callbacks)
export async function processMollieWebhookAction(paymentId: string) {
  const mollieKey = process.env.MOLLIE_API_KEY;
  if (!mollieKey) return { success: false };

  try {
    // Verifieer betaalstatus bij Mollie
    const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mollieKey}` },
    });

    const payment = await response.json() as MolliePaymentResponse;

    if (payment.status === "paid") {
      const { userId, plan } = payment.metadata || {};

      if (!userId || !plan) {
        return { success: false, error: "Ontbrekende Mollie metadata" };
      }

      // Update gebruiker in database
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: plan,
          subscriptionStatus: "ACTIVE",
          mollieSubscriptionId: paymentId,
        },
      });

      // Stuur welkomstnotificatie
      await prisma.notification.create({
        data: {
          userId,
          title: "Welkom bij " + (plan === 'PREMIUM' ? 'Operator' : 'Business') + "!",
          message: `Je abonnement is geactiveerd. Alle ${plan} features zijn nu beschikbaar.`,
        },
      });

      return { success: true, userId, plan };
    }

    return { success: false, status: payment.status };
  } catch (error) {
    console.error("processMollieWebhookAction error:", error);
    return { success: false };
  }
}
