import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // In productie ontvangt deze route de Mollie Webhook Payload (id)
    // De webhook payload bevat payment_id.
    const body = await req.json();
    const { paymentId, amount, franchiseId } = body;

    console.log(`[MOLLIE WEBHOOK] Processing payment ${paymentId} for Franchise ${franchiseId}`);

    // Simulatie van de 25% Tolpoort (Revenue Share Interceptor)
    const totalAmount = parseFloat(amount);
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

  } catch (error: any) {
    console.error('Mollie webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
