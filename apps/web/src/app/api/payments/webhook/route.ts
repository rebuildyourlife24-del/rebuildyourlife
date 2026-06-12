import { NextResponse } from 'next/server';
import { processMollieWebhookAction } from '@/app/actions/payments';

// Mollie stuurt een POST naar deze URL bij elke betalingsstatus update
export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const paymentId = body.get('id') as string;

    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    const result = await processMollieWebhookAction(paymentId);

    if (result.success) {
      console.log(`Betaling verwerkt: ${paymentId} voor gebruiker ${result.userId} — Plan: ${result.plan}`);
    }

    // Mollie verwacht altijd een 200 OK
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Mollie webhook error:', error);
    // Nog steeds 200 teruggeven zodat Mollie niet opnieuw probeert
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
