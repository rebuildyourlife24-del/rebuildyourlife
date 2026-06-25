import { NextResponse } from 'next/server';
import { prisma } from "@rebuildyourlife/database";



export async function POST(req: Request) {
  try {
    // 1. Resolve the Payment ID from the Mollie Webhook Payload (which is urlencoded format: id=tr_xxx)
    let paymentId: string | null = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      paymentId = formData.get("id") as string;
    } else {
      // Fallback for JSON mock requests
      const json = await req.json().catch(() => ({}));
      paymentId = json.id || json.paymentId;
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID provided' }, { status: 400 });
    }

    const mollieKey = process.env.MOLLIE_API_KEY;

    if (!mollieKey || mollieKey.startsWith("test_REPLACE") || mollieKey === "") {
      console.error("[MOLLIE WEBHOOK] CRITICAL ERROR: Mollie API key not configured on server. Rejecting webhook.");
      return NextResponse.json({ error: "Mollie API key not configured on server" }, { status: 500 });
    }

    // --- REAL MOLLIE WEBHOOK INTEGRATION ---
    console.log(`[MOLLIE WEBHOOK] Fetching details for payment ${paymentId}`);
    
    const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${mollieKey}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Failed to fetch payment details for ${paymentId}: ${errText}`);
      return NextResponse.json({ error: "Failed to fetch payment details from Mollie" }, { status: 400 });
    }

    const payment = await response.json();
    const { userId, tier } = payment.metadata || {};

    if (payment.status === "paid") {
      if (!userId) {
        console.error(`[MOLLIE WEBHOOK] Payment ${paymentId} is paid but missing userId in metadata.`);
        return NextResponse.json({ error: "Missing userId in metadata" }, { status: 400 });
      }

      console.log(`[MOLLIE WEBHOOK] Processing successful payment ${paymentId} for User ${userId}`);

      // Update user in database
      await prisma.user.update({
        where: { id: userId },
        data: {
          mollieCustomerId: payment.customerId || null,
          subscriptionStatus: "ACTIVE",
          subscriptionTier: tier || "ECOM",
          onboardingCompleted: true,
        },
      });

      // Send welcome notification
      await prisma.notification.create({
        data: {
          userId,
          title: `Welkom bij ${tier === 'ECOM' ? 'Commerce Syndicate' : tier === 'TECH' ? 'SaaS Protocol' : 'Elite Team'}!`,
          message: `Je onboarding betaling is succesvol verwerkt. Je hebt nu toegang tot alle ${tier === 'ECOM' ? 'Commerce Syndicate' : tier === 'TECH' ? 'SaaS Protocol' : 'Elite Team'} functionaliteiten.`,
        },
      });

      // Split Payment Simulation
      const amountVal = payment.amount?.value || "0.00";
      const totalAmount = parseFloat(amountVal);
      const platformCut = totalAmount * 0.25;
      const franchiseCut = totalAmount * 0.75;

      console.log(`[SPLIT PAYMENT ROUTING]`);
      console.log(` -> €${franchiseCut.toFixed(2)} routed to Franchise-nemer.`);
      console.log(` -> €${platformCut.toFixed(2)} routed to Supreme Overseer (Treasury).`);

      return NextResponse.json({ 
        success: true,
        status: 'paid',
        split: {
          franchise: franchiseCut,
          treasury: platformCut
        }
      });
    } else {
      console.log(`[MOLLIE WEBHOOK] Payment ${paymentId} updated with status: ${payment.status}`);

      if (userId && ["failed", "expired", "canceled"].includes(payment.status)) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: payment.status.toUpperCase(),
          },
        });
      }

      return NextResponse.json({ success: true, status: payment.status });
    }

  } catch (error: any) {
    console.error('Mollie webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
