import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { createMollieClient } from '@mollie/api-client';

export const dynamic = 'force-dynamic';

const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_dummy_key_if_missing' 
});

export async function GET() {
  try {
    // 1. Fetch all Shopify stores with active status
    const stores = await prisma.shopifyStore.findMany({
      where: { status: 'ACTIVE' }
    });

    const billedStores = [];

    for (const store of stores) {
      if (store.totalRevenue <= 0) continue;

      // Calculate the 8% platform fee
      const feeAmount = store.totalRevenue * 0.08;

      // 2. Fetch or create the User's Wallet
      let wallet = await prisma.userWallet.findUnique({
        where: { userId: store.userId }
      });

      if (!wallet) {
        wallet = await prisma.userWallet.create({
          data: {
            userId: store.userId,
            fiatBalance: 0
          }
        });
      }

      // Deduct fee from wallet balance (simulating the billing invoice charge)
      await prisma.userWallet.update({
        where: { id: wallet.id },
        data: {
          fiatBalance: {
            decrement: feeAmount
          }
        }
      });

      // Create transaction record
      await prisma.platformCreditTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -feeAmount,
          type: "PLATFORM_FEE",
          description: `8% Platform Fee for Shopify Store ${store.shopUrl} (Bruto: €${store.totalRevenue.toFixed(2)})`,
          status: "COMPLETED"
        }
      });

      // 3. Initiate Mollie payment request to collect the fee
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rebuildyourlife.eu';
      
      let paymentUrl = '';
      try {
        const payment = await mollieClient.payments.create({
          amount: {
            currency: 'EUR',
            value: feeAmount.toFixed(2),
          },
          description: `RYL 8% Platform Fee - Store: ${store.shopUrl}`,
          redirectUrl: `${baseUrl}/dashboard/ecommerce?payment=success`,
          webhookUrl: `${baseUrl}/api/payments/mollie/webhook`,
          metadata: {
            userId: store.userId,
            storeId: store.id,
            type: 'PLATFORM_FEE'
          },
        });
        paymentUrl = payment.getCheckoutUrl() || '';
      } catch (err) {
        console.error(`Mollie payment creation failed for store ${store.shopUrl}:`, err);
      }

      // 4. Log to AgentDossier
      await prisma.agentDossier.create({
        data: {
          agentType: "FINANCIAL",
          action: "BILLED_PLATFORM_FEE",
          target: store.shopUrl,
          details: `Billed 8% fee of €${feeAmount.toFixed(2)} on gross revenue of €${store.totalRevenue.toFixed(2)}. Mollie payment generated.`,
          userId: store.userId
        }
      });

      billedStores.push({
        storeUrl: store.shopUrl,
        revenue: store.totalRevenue,
        fee: feeAmount,
        paymentUrl
      });
    }

    return NextResponse.json({
      success: true,
      processed: billedStores.length,
      billingLogs: billedStores
    });
  } catch (error: any) {
    console.error("Monthly billing job failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
