'use server';

import { createMollieClient } from '@mollie/api-client';
import { prisma } from '@rebuildyourlife/database';
import bcrypt from 'bcryptjs';

const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_dummy_key' 
});

export async function createEliteCheckoutAction(email: string, passwordRaw: string, affiliateCode?: string) {
  try {
    // 1. Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    // 2. Create if not exists (Status PENDING)
    if (!user) {
      const hashedPassword = await bcrypt.hash(passwordRaw, 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0],
          subscriptionStatus: 'PENDING',
          subscriptionTier: 'ELITE'
        }
      });
    }

    // 3. Create Wallet if needed
    const wallet = await prisma.userWallet.findUnique({ where: { userId: user.id } });
    if (!wallet) {
      await prisma.userWallet.create({ data: { userId: user.id } });
    }

    // 4. Create Mollie Payment
    const payment = await mollieClient.payments.create({
      amount: {
        value: '2000.00',
        currency: 'EUR'
      },
      description: 'Sovereign Grid - Elite Package',
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboarding`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ry-app.ngrok.app'}/api/mollie/webhook`,
      metadata: {
        userId: user.id,
        tier: 'ELITE',
        affiliateCode: affiliateCode || null
      }
    });

    return {
      success: true,
      checkoutUrl: payment.getCheckoutUrl()
    };
  } catch (error: any) {
    console.error('Mollie Checkout Error:', error);
    if (process.env.NODE_ENV === 'development') {
        return {
            success: true,
            checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboarding?mock_payment=true`
        }
    }
    return {
      success: false,
      error: error.message
    };
  }
}
