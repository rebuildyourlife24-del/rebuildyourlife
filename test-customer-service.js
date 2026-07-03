require('dotenv').config({ path: '.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testCustomerService() {
  console.log("\n=============================================");
  console.log("   [TEST] AI KLANTENSERVICE WEBHOOK (MODEL 1)");
  console.log("=============================================\n");

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;
  if (!apiKey) {
    console.error("FOUT: GEMINI_API_KEY niet gevonden in .env");
    return;
  }

  // Simuleer een inkomende payload van Shopify Inbox
  const payload = {
    storeName: "Sovereign Watches",
    customerName: "Henk",
    orderId: "#SW-9920",
    orderStatus: "Verzonden",
    customerMessage: "Waar blijft mijn pakketje? Het zou gisteren al binnen zijn en ik heb het nodig voor een verjaardag. Dit is echt belachelijk!"
  };

  console.log("INCOMING WEBHOOK PAYLOAD (SHOPIFY):");
  console.log(payload);
  console.log("\n[⏳] Genereren van autonoom support-antwoord via Gemini 1.5 Pro...\n");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `Je bent een uiterst professionele en empathische AI klantenservice medewerker voor de webshop "${payload.storeName}".
Jouw taak is om autonoom een antwoord te formuleren op de vraag of klacht van de klant.
Regels:
1. Wees altijd beleefd, meelevend en oplossingsgericht.
2. Gebruik de beschikbare order-informatie indien relevant.
3. Spreek de klant aan met de voornaam als deze bekend is.
4. Sluit af met een professionele groet namens het support team.
5. Verzin GEEN valse beloftes. Als het order-status 'verzonden' is, benadruk dan dat het onderweg is.`;

  const prompt = `
[ORDER INFORMATIE]
Klant: ${payload.customerName}
Order ID: ${payload.orderId}
Order Status: ${payload.orderStatus}

[BERICHT VAN KLANT]
"${payload.customerMessage}"

Schrijf nu het perfecte antwoord namens de webshop:`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      generationConfig: { temperature: 0.3 }
    });

    const aiResponse = result.response.text();
    
    console.log("=============================================");
    console.log("   [✅] GEGENEREERD ANTWOORD (AI REPLY)");
    console.log("=============================================\n");
    console.log(aiResponse);
    console.log("\n=============================================");
    console.log("[⚡] Dit antwoord wordt nu via de Webhook API automatisch teruggestuurd naar Shopify/Zendesk.");
    
  } catch (err) {
    console.error("FOUT TIJDENS GENERATIE:", err);
  }
}

testCustomerService();
