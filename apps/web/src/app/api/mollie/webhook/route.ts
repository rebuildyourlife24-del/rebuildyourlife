import { NextResponse } from 'next/server';
// MOCK WEBHOOK - Prisma not used yet

export async function POST(req: Request) {
  try {
    // --- MOCK MOLLIE WEBHOOK LOGIC ---
    // Mollie sends form-data with the `id` of the payment
    const formData = await req.formData();
    const paymentId = formData.get('id');

    console.log(`[OMEGA PROTOCOL] Mollie Webhook received for payment: ${paymentId}`);

    // In a real scenario, we fetch the payment status from Mollie API:
    // const payment = await mollieClient.payments.get(paymentId);
    // if (payment.isPaid()) { ... }

    // We will simulate a successful payment for now
    // NOTE: Without a user context in the webhook (unless passed via metadata),
    // we would look up the user by the mollieCustomerId or payment metadata.
    
    // Return a 200 OK so Mollie knows we received it
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Mollie Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
