import { NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { prisma } from '@rebuildyourlife/database';

const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_dummy_key_if_missing' 
});

export async function POST(req: Request) {
  try {
    // Mollie sends the payment ID as application/x-www-form-urlencoded
    const text = await req.text();
    const params = new URLSearchParams(text);
    const paymentId = params.get('id');

    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID provided' }, { status: 400 });
    }

    // Fetch the payment status from Mollie
    const payment = await mollieClient.payments.get(paymentId);
    
    // Only process if payment is paid and we haven't processed it yet
    if (payment.isPaid() && !payment.hasRefunds() && !payment.hasChargebacks()) {
      const userId = payment.metadata?.userId;
      
      if (!userId) {
        console.error('Mollie Webhook Error: No userId in metadata for payment', paymentId);
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      // Start transaction to update wallet
      await prisma.$transaction(async (tx) => {
        let wallet = await tx.userWallet.findUnique({
          where: { userId }
        });

        if (!wallet) {
          wallet = await tx.userWallet.create({
            data: { userId, fiatBalance: 0 }
          });
        }

        const amount = parseFloat(payment.amount.value);

        // Verify if we already processed this exact payment ID (idempotency check)
        const existingTx = await tx.platformCreditTransaction.findFirst({
          where: { 
            walletId: wallet.id,
            description: { contains: paymentId }
          }
        });

        if (existingTx) {
          console.log(`Payment ${paymentId} already processed. Skipping.`);
          return;
        }

        // Add funds
        await tx.userWallet.update({
          where: { id: wallet.id },
          data: { fiatBalance: { increment: amount } }
        });

        // Log transaction
        await tx.platformCreditTransaction.create({
          data: {
            walletId: wallet.id,
            amount: amount,
            type: 'DEPOSIT',
            description: `Mollie Deposit (ID: ${paymentId})`,
          }
        });

        // Add memory log
        await tx.aIMemory.create({
          data: {
            userId: userId,
            agentType: 'FINANCE',
            memoryType: 'WALLET_TOPUP',
            content: `User successfully deposited €${payment.amount.value} into Operating Wallet.`
          }
        });
        
        console.log(`✅ Successfully processed €${amount} deposit for user ${userId}`);
      });
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Mollie Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
