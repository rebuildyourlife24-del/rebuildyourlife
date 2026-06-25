import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, tierName, priceId } = body;

    if (!email || !priceId) {
      return new NextResponse('Email and Price ID are required', { status: 400 });
    }

    // Controleer of de gebruiker al bestaat
    let user = await db.user.findUnique({
      where: { email }
    });

    // Als de gebruiker niet bestaat, maak er een aan
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          firstName: 'Nieuwe',
          lastName: 'Klant',
          passwordHash: 'pending_setup',
          subscriptionTier: 'PENDING'
        }
      });
    }

    // Controleer of er al een Stripe Customer ID is
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
      
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId }
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card', 'ideal'], // iDEAL voor NL/BE
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rebuildyourlife.eu'}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rebuildyourlife.eu'}/vsl?canceled=true`,
      metadata: {
        userId: user.id,
        tierName: tierName
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
