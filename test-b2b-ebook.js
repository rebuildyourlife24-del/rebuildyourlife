require('dotenv').config({ path: '.env' });

async function testB2BEbook() {
  console.log("\n=======================================================");
  console.log("   [TEST] MODEL 6: B2B E-BOOKS / PDF CURSUSSEN");
  console.log("=======================================================\n");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("FOUT: GROQ API Key ontbreekt in .env");
    return;
  }

  const payload = {
    topic: "Automatiseren van je klantenservice met AI in 2024",
    targetAudience: "MKB Eigenaren in Nederland met webshops",
    price: 97.00
  };

  console.log("INCOMING API REQUEST (KLANT BESTELT E-BOOK GENERATIE):");
  console.log(payload);
  console.log(`\n[⏳] Schrijven van Premium E-book content (Target Prijs: €${payload.price})...`);

  const prompt = `Je bent een meesterlijke B2B auteur en industrie-expert.
    Schrijf de introductie en het eerste gigantisch waardevolle hoofdstuk voor een premium E-book (€${payload.price}) over het onderwerp: "${payload.topic}".
    Doelgroep: ${payload.targetAudience}.
    
    Regels:
    1. Geef extreem waardevolle, direct toepasbare zakelijke adviezen. Geen fluff.
    2. Gebruik HTML opmaak (<h1> voor de boektitel, <h2> voor hoofdstukken, <ul> voor opsommingen).
    3. Zorg dat het leest als een dure mastermind cursus.
    4. Beperk tot max 150 woorden voor deze test.
    
    Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
    {
      "bookTitle": "De meesterlijke boektitel",
      "htmlContent": "De volledige HTML string"
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
        temperature: 0.7
      })
    });

    const aiData = await response.json();
    if (!aiData.choices) {
      console.error("GROQ API ERROR:", aiData);
      return;
    }
    const generatedBook = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] PREMIUM E-BOOK GEGENEREERD EN KLAAR VOOR VERKOOP");
    console.log("=======================================================\n");
    console.log(`TITEL: ${generatedBook.bookTitle}`);
    console.log(`Mollie Betaallink (Mock): https://useplink.com/payment/e-book-991`);
    console.log(`\nBOEK PREVIEW (HTML-Raw):`);
    console.log("-------------------------------------------------------");
    console.log(generatedBook.htmlContent);
    console.log("-------------------------------------------------------");

    console.log("\n=======================================================");
    console.log("   [🏛️] ENTERPRISE ADMINISTRATIE LOG (enterprise.ai-henksemler.nl)");
    console.log("=======================================================\n");
    console.log(`[LOG-ID: EBOOK-GEN-922] Premium E-book ('${generatedBook.bookTitle}') gegenereerd.`);
    console.log(`Klaar voor geautomatiseerde PDF conversie en Mollie Paywall koppeling.`);
    
  } catch (error) {
    console.error("FOUT TIJDENS GENERATIE:", error);
  }
}

testB2BEbook();
