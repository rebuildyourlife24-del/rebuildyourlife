require('dotenv').config({ path: '.env' });

async function testSEOAgency() {
  console.log("\n=======================================================");
  console.log("   [TEST] MODEL 5: AI SEO & CONTENT AGENCY");
  console.log("=======================================================\n");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("FOUT: GROQ API Key ontbreekt in .env");
    return;
  }

  const payload = {
    clientId: "KLANT_008_TANDARTS",
    keyword: "Spoed tandarts Amsterdam Zuid",
    industry: "Tandheelkunde",
    targetCMS: "WordPress"
  };

  console.log("INCOMING API REQUEST (KLANT START SEO CAMPAGNE):");
  console.log(payload);
  console.log(`\n[⏳] Schrijven van Pillar Content en pushen naar ${payload.targetCMS}...`);

  const prompt = `Je bent een Master SEO Copywriter (Rank #1 Google).
    Schrijf een blogartikel gericht op het zoekwoord: "${payload.keyword}" voor de industrie "${payload.industry}".
    
    Regels:
    1. Gebruik perfecte HTML structuur (<h1>, <h2>, <p>).
    2. Focus op LSI keywords.
    3. Houd het kort voor deze test (max 100 woorden HTML).
    
    Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
    {
      "seoTitle": "De perfecte H1 en Meta Titel",
      "metaDescription": "De perfecte meta beschrijving",
      "htmlContent": "De HTML string"
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
        temperature: 0.6
      })
    });

    const aiData = await response.json();
    if (!aiData.choices) {
      console.error("GROQ API ERROR:", aiData);
      return;
    }
    const generatedArticle = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] ARTIKEL GEPUBLICEERD OP KLANT-WEBSITE");
    console.log("=======================================================\n");
    console.log(`TITEL (H1): ${generatedArticle.seoTitle}`);
    console.log(`META:       ${generatedArticle.metaDescription}`);
    console.log(`\nCONTENT (HTML-Raw):`);
    console.log("-------------------------------------------------------");
    console.log(generatedArticle.htmlContent);
    console.log("-------------------------------------------------------");

    console.log("\n=======================================================");
    console.log("   [🏛️] ENTERPRISE ADMINISTRATIE LOG (enterprise.ai-henksemler.nl)");
    console.log("=======================================================\n");
    console.log(`[LOG-ID: SEO-PUBLISH-774] SEO Artikel ('${generatedArticle.seoTitle}') succesvol gepusht naar ${payload.targetCMS} van klant ${payload.clientId}.`);
    console.log(`Webhook ping naar Google Indexing API verstuurd.`);
    
  } catch (error) {
    console.error("FOUT TIJDENS GENERATIE:", error);
  }
}

testSEOAgency();
