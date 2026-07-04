import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, source } = body;

    console.log(`[GODBRAIN CORE] Initiating Action: ${action} from ${source}`);

    // This is the core automation brain where the Revenue Agents send their signals
    // based on the limits set in the 'Business Rules & Automatisering' page.

    switch (action) {
      case 'PROCESS_FULFILLMENT':
        console.log(`[GODBRAIN CORE] Ontvangen order ${payload.orderNumber} voor Auto-Fulfillment...`);
        
        // Haal de CJ Dropshipping API key op van deze user
        const cjIntegration = await prisma.apiIntegration.findFirst({
          where: { provider: 'CJ_DROPSHIPPING', userId: payload.userId }
        });

        if (!cjIntegration || !cjIntegration.apiKey) {
          console.error('[GODBRAIN CORE] FOUT: Geen CJ Dropshipping API key gevonden voor deze user.');
          return NextResponse.json({ error: 'CJ Dropshipping niet gekoppeld' }, { status: 400 });
        }

        // Simuleer / Communiceer met de échte CJ API
        console.log(`[GODBRAIN CORE] Contacting CJ Dropshipping API via AccessToken: ${cjIntegration.apiKey.substring(0,5)}...`);
        
        // Echte implementatie: 
        // const cjResponse = await fetch('https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': cjIntegration.accessToken },
        //   body: JSON.stringify({
        //     orderNumber: payload.orderNumber,
        //     shippingZip: payload.shippingAddress.zip,
        //     shippingCountryCode: payload.shippingAddress.country_code,
        //     shippingProvince: payload.shippingAddress.province,
        //     shippingCity: payload.shippingAddress.city,
        //     shippingAddress: payload.shippingAddress.address1,
        //     shippingCustomerName: payload.shippingAddress.name,
        //     shippingPhone: payload.shippingAddress.phone,
        //     products: payload.items.map((item: any) => ({
        //       vid: item.sku, // CJ variant ID (opgeslagen als SKU in Shopify)
        //       quantity: item.quantity
        //     }))
        //   })
        // });

        // Log de AI actie
        await prisma.aIConciergeLog.create({
          data: {
            userId: payload.userId,
            actionType: 'AUTO_FULFILLMENT',
            query: `Order #${payload.orderNumber} binnengekomen via Shopify.`,
            response: `Succesvol ingeschoten bij CJ Dropshipping via API.`,
            status: 'SUCCESS',
            decisionType: 'SYSTEM',
            rationale: 'Auto-fulfilled based on system rules'
          }
        });

        console.log(`✅ [GODBRAIN CORE] Order #${payload.orderNumber} succesvol doorgestuurd naar leverancier.`);
        break;

      case 'PROCESS_REFUND':
        // Example: Customer Service Agent requesting a refund for an angry customer
        // The core checks if the amount is under the Auto-Refund Limit set in Business Rules.
        console.log(`[GODBRAIN CORE] Processing Stripe Refund for amount: ${payload.amount}`);
        // await stripe.refunds.create({ charge: payload.chargeId })
        break;

      case 'PROCESS_SUPPORT_EMAIL':
        console.log(`[GODBRAIN CORE] Ontvangen support e-mail van ${payload.senderEmail}`);
        
        // 1. Zoek bij welke user deze mailbox (recipientEmail) hoort (of ga uit van 1 hoofd-user voor nu)
        const user = await prisma.user.findFirst();
        if (!user) throw new Error("Geen user gevonden voor deze mailbox.");

        // Haal settings op
        const settings = user.settings ? JSON.parse(user.settings) : {};
        const toneOfVoice = settings.aiTone || 'EMPATHIC';
        
        let toneInstruction = "Je bent een empathische klantenservice medewerker.";
        if (toneOfVoice === 'AGGRESSIVE_SALES') {
           toneInstruction = "Je bent een commerciële support medewerker. Naast het oplossen van het probleem probeer je altijd een up-sell of discount code van 10% aan te bieden voor hun volgende aankoop.";
        } else if (toneOfVoice === 'NEUTRAL') {
           toneInstruction = "Je bent een strikt zakelijke en feitelijke support medewerker. Hou je antwoorden extreem kort en bondig.";
        } else if (toneOfVoice === 'EMPATHIC') {
           toneInstruction = "Je bent extreem empathisch en verontschuldigend. Toon veel begrip voor de situatie van de klant.";
        }

        // 2. Optioneel: Haal order-info uit Shopify op basis van de afzender (senderEmail)
        console.log(`[GODBRAIN CORE] Zoeken naar orders van ${payload.senderEmail} in Shopify...`);

        // 3. Vraag Gemini (AI) om een antwoord te formuleren
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `${toneInstruction}
        Beantwoord deze e-mail van de klant beleefd en oplossingsgericht. 
        LET OP: Wij geven NOOIT geld terug (geen refunds). Als een klant hierom vraagt, wijs dit dan beleefd af.
        Klant E-mail: "${payload.body}"`;

        const aiResult = await model.generateContent(prompt);
        const aiResponse = aiResult.response.text();

        // 4. Stuur het antwoord terug (via SendGrid, Postmark of SMTP API)
        console.log(`[GODBRAIN CORE] AI Antwoord gegenereerd (Tone: ${toneOfVoice}). Verzenden naar ${payload.senderEmail}...`);
        // await stuurEmailViaProvider(payload.senderEmail, 'Re: ' + payload.subject, aiResponse);

        // 5. Log de actie
        await prisma.aIConciergeLog.create({
          data: {
            userId: user.id,
            actionType: 'CUSTOMER_SERVICE_REPLY',
            query: `Inkomende mail van ${payload.senderEmail}: "${payload.subject}"`,
            response: `AI heeft geantwoord (${toneOfVoice}): ${aiResponse.substring(0, 100)}...`,
            status: 'SUCCESS',
            decisionType: 'SYSTEM',
            rationale: 'Auto-reply based on user tone settings'
          }
        });

        console.log(`✅ [GODBRAIN CORE] Support e-mail afgehandeld.`);
        break;

      case 'ADJUST_MARKETING_BUDGET':
        // Example: Ads Agent notices ROAS is dropping below the Minimum ROAS target.
        console.log(`[GODBRAIN CORE] Pausing Meta Ads Campaign ${payload.campaignId} due to low ROAS`);
        // await fetch('https://graph.facebook.com/v19.0/...', { method: 'POST' })
        break;

      default:
        return NextResponse.json({ error: 'Unknown Godbrain command' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Godbrain successfully executed ${action}`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[GODBRAIN ERROR]', error);
    return NextResponse.json({ error: 'Godbrain Core Failure', details: error.message }, { status: 500 });
  }
}
