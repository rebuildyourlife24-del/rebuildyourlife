import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const paymentId = formData.get('id') as string;

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 });
    }

    const mollieKey = process.env.MOLLIE_API_KEY;
    if (!mollieKey) {
      console.error("Missing MOLLIE_API_KEY");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const mollieClient = createMollieClient({ apiKey: mollieKey });
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.isPaid()) {
      console.log(`✅ Payment ${paymentId} completed successfully!`);
      const metadata = payment.metadata;
      
      console.log("Upgrading user:", metadata.email, "to plan:", metadata.plan);
      // NOTE: Here you would normally update the Prisma Database using:
      // await prisma.user.update({ where: { id: metadata.userId }, data: { role: 'ELITE' } });
      // If it was a High-Ticket sale through an affiliate, you'd calculate the €500 commission here.
    } else {
      console.log(`Payment ${paymentId} status: ${payment.status}`);
    }

    return new NextResponse('OK', { status: 200 });

  } catch (error: any) {
    console.error('Mollie webhook error:', error);
    return new NextResponse('Error handling webhook', { status: 500 });
  }
}
