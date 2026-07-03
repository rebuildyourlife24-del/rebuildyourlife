require('dotenv').config({ path: '.env' });

async function testTranslation() {
  console.log("\n=======================================================");
  console.log("   [TEST] MODEL 9: AI VERTALINGEN (BULK TRANSLATION)");
  console.log("=======================================================\n");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("FOUT: GROQ API Key ontbreekt in .env");
    return;
  }

  const payload = {
    clientId: "TRANS_CLIENT_004",
    targetLanguage: "Duits",
    sourceText: "<h1>The Ultimate AI Software</h1><p>Our platform allows you to scale your business by 10x without hiring a single employee. Buy now!</p>"
  };

  console.log("INCOMING API REQUEST (BULK TRANSLATION):");
  console.log(payload);
  console.log(`\n[⏳] Translating to ${payload.targetLanguage} while maintaining HTML structure...`);

  const prompt = `Je bent een Master Translator. Vertaal de volgende tekst naar het ${payload.targetLanguage}.
  Behoud exact dezelfde tone-of-voice, HTML/Markdown formatting en intentie.
  
  Brontekst:
  ${payload.sourceText}
  
  Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
  {
    "translatedText": "De volledige vertaalde tekst"
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
        temperature: 0.1
      })
    });

    const aiData = await response.json();
    if (!aiData.choices) {
      console.error("GROQ API ERROR:", aiData);
      return;
    }
    const translationData = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] VERTALING SUCCESVOL");
    console.log("=======================================================\n");
    console.log(`Source (${payload.sourceText.length} chars) -> Target (${payload.targetLanguage})`);
    console.log("-------------------------------------------------------");
    console.log(translationData.translatedText);
    console.log("-------------------------------------------------------");

    console.log("\n=======================================================");
    console.log("   [🏛️] ENTERPRISE ADMINISTRATIE LOG (enterprise.ai-henksemler.nl)");
    console.log("=======================================================\n");
    console.log(`[LOG-ID: TRANS-991] Vertaling naar ${payload.targetLanguage} afgerond.`);
    console.log(`Klant ${payload.clientId} gefactureerd voor token usage.`);
    
  } catch (error) {
    console.error("FOUT TIJDENS GENERATIE:", error);
  }
}

testTranslation();
