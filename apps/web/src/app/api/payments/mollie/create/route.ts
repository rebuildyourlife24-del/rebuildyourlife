import { NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { getSessionAction } from '@/app/actions/auth';

const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_dummy_key_if_missing' 
});

export async function POST(req: Request) {
  try {
    const session = await getSessionAction(); const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let amount;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      amount = body.amount;
    } else {
      const formData = await req.formData();
      amount = formData.get('amount');
    }

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Minimum deposit is €10' }, { status: 400 });
    }

    // Determine base URL dynamically or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create a Mollie payment
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: Number(amount).toFixed(2), // Mollie expects strings like "10.00"
      },
      description: `RYL Operating Wallet Deposit - ${user.email}`,
      redirectUrl: `${baseUrl}/dashboard/approvals?payment=success`,
      webhookUrl: `${baseUrl}/api/payments/mollie/webhook`, // Mollie hits this in background
      metadata: {
        userId: user.id,
      },
    });

    // Return checkout URL or redirect if requested via form
    if (contentType.includes('application/json')) {
      return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
    } else {
      return NextResponse.redirect(payment.getCheckoutUrl()!, 303);
    }

  } catch (error: any) {
    console.error('Mollie Payment Error:', error);
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}
