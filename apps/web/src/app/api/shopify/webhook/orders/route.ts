import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@rebuildyourlife/database';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    const shopUrl = req.headers.get('x-shopify-shop-domain');

    if (!hmacHeader || !shopUrl) {
      return NextResponse.json({ error: 'Missing Shopify headers' }, { status: 400 });
    }

    // Security: Verify Shopify Webhook HMAC Signature
    const sharedSecret = process.env.SHOPIFY_WEBHOOK_SECRET || '';
    if (!sharedSecret) {
      console.error('[SHOPIFY WEBHOOK ERROR] Geen SHOPIFY_WEBHOOK_SECRET ingesteld.');
      return NextResponse.json({ error: 'Server misconfiguratie' }, { status: 500 });
    }

    const hash = crypto.createHmac('sha256', sharedSecret).update(bodyText, 'utf8').digest('base64');
    if (hash !== hmacHeader) {
      console.error('[SHOPIFY WEBHOOK ERROR] Ongeldige HMAC handtekening!');
      return NextResponse.json({ error: 'Invalid HMAC Signature' }, { status: 401 });
    }

    if (topic !== 'orders/paid') {
      return NextResponse.json({ message: 'Ignored, not orders/paid' });
    }

    const orderData = JSON.parse(bodyText);
    console.log(`[SHOPIFY WEBHOOK] Nieuwe betaalde order ontvangen van ${shopUrl}: Order #${orderData.order_number}`);

    // Vind de ShopifyStore in onze database om te controleren bij welke User hij hoort
    const store = await prisma.shopifyStore.findFirst({
      where: { shopUrl: shopUrl }
    });

    if (!store) {
      console.error(`[SHOPIFY WEBHOOK] Store ${shopUrl} niet gevonden in onze database!`);
      return NextResponse.json({ error: 'Store niet geregistreerd' }, { status: 404 });
    }

    // Haal de Business Rules van de user op (staan in FeatureFlag of Godbrain settings)
    // Voor nu sturen we de order direct door naar the Godbrain Core voor evaluatie.
    
    console.log(`[SHOPIFY WEBHOOK] Order #${orderData.order_number} wordt doorgestuurd naar Godbrain Auto-Fulfillment Agent...`);

    // Interne call naar de Vercel Native Python AI Backend
    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    const godbrainResponse = await fetch(`${backendUrl}/api/finance/revenue/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: store.userId,
        amount: parseFloat(orderData.total_price || 0)
      })
    });

    const result = await godbrainResponse.json();

    return NextResponse.json({ 
      success: true, 
      message: 'Order ontvangen en door Godbrain verwerkt',
      godbrain: result 
    });

  } catch (error: any) {
    console.error('[SHOPIFY WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Interne fout bij Shopify webhook', details: error.message }, { status: 500 });
  }
}
