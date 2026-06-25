import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { headers } from 'next/headers';


export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;

  let event: any;

  try {
    throw new Error('Stripe disabled'); // event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === 'checkout.session.completed') {
    throw new Error('Stripe disabled'); // const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse('User ID is missing in metadata', { status: 400 });
    }

    // Update de database
    await db.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          ((subscription as any).current_period_end || (subscription as any).data?.current_period_end) * 1000
        ),
        subscriptionTier: session.metadata.tierName || 'PRO',
        subscriptionStatus: 'ACTIVE',
      },
    });

    // Laat de AI Conciërge weten dat we een nieuwe klant hebben!
    await (db.aIConciergeLog.create as any)({
      data: {
        userId: session.metadata.userId,
        actionType: 'NEW_SUBSCRIPTION',
        query: `Stripe checkout completed for tier: ${session.metadata.tierName}`,
        response: 'Automatisch toegang verleend',
        status: 'SUCCESS',
        decisionType: 'SYSTEM'
      }
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as any;
    if (!invoice.subscription) return new NextResponse(null, { status: 200 });

    throw new Error('Stripe disabled'); // const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );

    await db.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          ((subscription as any).current_period_end || (subscription as any).data?.current_period_end) * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}


