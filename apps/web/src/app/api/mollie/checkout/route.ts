import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');

    if (!type || (type !== 'subscription' && type !== 'highticket')) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Get current user to link payment to them
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Use test API key by default if live is not provided, or fallback to env var
    const mollieKey = process.env.MOLLIE_API_KEY;
    if (!mollieKey) {
      console.error("Missing MOLLIE_API_KEY");
      return NextResponse.redirect(new URL('/dashboard/billing?error=mollie_not_configured', req.url));
    }

    const mollieClient = createMollieClient({ apiKey: mollieKey });

    let amount = { currency: 'EUR', value: '50.00' };
    let description = 'Sovereign OS Abonnement (Maandelijks)';
    
    if (type === 'highticket') {
      amount = { currency: 'EUR', value: '2000.00' };
      description = 'Sovereign OS Elite Pakket (Lifetime + Affiliate Rechten)';
    }

    // Note: To set up a real subscription with Mollie, you would use Customers & Mandates.
    // For this demonstration/V1, we create a standard payment. 
    // The webhook will later process it and update the Prisma DB.
    
    const payment = await mollieClient.payments.create({
      amount: amount,
      description: description,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?success=true`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-production-url.com'}/api/mollie/webhook`,
      metadata: {
        userId: user?.id || 'guest',
        plan: type,
        email: user?.email || 'unknown'
      }
    });

    if (payment._links?.checkout?.href) {
      return NextResponse.redirect(payment._links.checkout.href);
    }

    throw new Error("Geen checkout URL ontvangen van Mollie");

  } catch (error: any) {
    console.error('Mollie checkout error:', error);
    return NextResponse.redirect(new URL('/dashboard/billing?error=checkout_failed', req.url));
  }
}
