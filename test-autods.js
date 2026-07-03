require('dotenv').config({ path: '.env' });

async function testAutoDS() {
  console.log("\n=======================================================");
  console.log("   [TEST] MODEL 2: AUTODS DROPSHIPPING & AI SEO");
  console.log("=======================================================\n");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("FOUT: GROQ API Key ontbreekt in .env");
    return;
  }

  const payload = {
    productId: "ALIEX-9382103",
    originalTitle: "2024 New Men Luxury Watch Waterproof Stainless Steel Quartz Analog Male Clock",
    originalDescription: "Cheap watch for men. Very good quality. Water proof 30m. Made of metal.",
    source: "AutoDS_AliExpress"
  };

  console.log("INCOMING WEKHOOK PAYLOAD (VAN AUTODS):");
  console.log(payload);
  console.log("\n[⏳] Sturen naar de AI SEO Engine (Groq Mixtral)...");

  const prompt = `Je bent een expert in E-commerce SEO. Herschrijf de volgende AliExpress/AutoDS product data naar een extreem goed verkopende, hoog-converterende Nederlandse producttitel en beschrijving. Zorg dat de titel een luxe 'Sovereign' gevoel geeft.
    
  Originele Titel: ${payload.originalTitle}
  Originele Beschrijving: ${payload.originalDescription}
  
  Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
  {
    "seoTitle": "Nieuwe pakkende titel (max 60 tekens)",
    "seoDescription": "Uitgebreide wervende tekst, opgedeeld in HTML paragrafen, gefocust op pijnpunten en emotie."
  }`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.5
      })
    });

    const aiData = await response.json();
    if (!aiData.choices) {
      console.error("GROQ API ERROR:", aiData);
      return;
    }
    const optimizedContent = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] AI SEO GENERATIE SUCCESVOL");
    console.log("=======================================================\n");
    console.log("Nieuwe Titel:");
    console.log(optimizedContent.seoTitle);
    console.log("\nNieuwe Beschrijving:");
    console.log(optimizedContent.seoDescription);

    console.log("\n=======================================================");
    console.log("   [🏛️] ENTERPRISE ADMINISTRATIE LOG (enterprise.ai-henksemler.nl)");
    console.log("=======================================================\n");
    console.log(`[LOG-ID: ECOM-921] Product ${payload.productId} autonoom vertaald en geoptimaliseerd.`);
    console.log(`API webhook triggert nu de Shopify push-API om het product live in de store te zetten.`);
    
  } catch (error) {
    console.error("FOUT TIJDENS GENERATIE:", error);
  }
}

testAutoDS();
