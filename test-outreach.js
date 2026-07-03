require('dotenv').config({ path: '.env' });

async function testOutreach() {
  console.log("\n=======================================================");
  console.log("   [TEST] MODEL 3: B2B LEADGENERATIE (COLD OUTREACH)");
  console.log("=======================================================\n");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("FOUT: GROQ API Key ontbreekt in .env");
    return;
  }

  const payload = {
    targetCompany: "Jumbo Supermarkten HQ",
    targetName: "Pieter",
    industry: "Retail & E-commerce",
    painPoint: "Veel tijd kwijt aan handmatige klantenservice en voorraadbeheer, trage reactietijden."
  };

  console.log("LEAD SCRAPED UIT APOLLO.IO:");
  console.log(payload);
  console.log("\n[⏳] Genereren van ultra-gepersonaliseerde AI Sales Email...");

  const prompt = `Je bent een meedogenloze B2B sales copywriter (God-Tier Closer).
    Schrijf een ultrakorte, hoog-converterende koude e-mail voor de volgende lead:
    
    Naam: ${payload.targetName}
    Bedrijf: ${payload.targetCompany}
    Industrie: ${payload.industry}
    Pijnpunt: ${payload.painPoint}
    
    Regels:
    1. Geen saaie introducties ("Ik hoop dat deze e-mail u goed bereikt").
    2. Direct to the point: benoem hun pijnpunt en bied de AI-oplossing (ons systeem).
    3. Sluit af met een zachte Call To Action (bijv: "Open voor een korte chat hierover?").
    4. Schrijf in vloeiend, zakelijk Nederlands.
    
    Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
    {
      "subject": "De perfecte clickbait/nieuwsgierigheid onderwerpregel",
      "emailBody": "De volledige e-mail tekst"
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
    const generatedEmail = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] AI SALES EMAIL KLAAR VOOR VERZENDING");
    console.log("=======================================================\n");
    console.log(`ONDERWERP: ${generatedEmail.subject}`);
    console.log("-------------------------------------------------------");
    console.log(generatedEmail.emailBody);
    console.log("-------------------------------------------------------");

    console.log("\n=======================================================");
    console.log("   [🏛️] ENTERPRISE ADMINISTRATIE LOG (enterprise.ai-henksemler.nl)");
    console.log("=======================================================\n");
    console.log(`[LOG-ID: B2B-OUTREACH-001] AI-Gegenereerde koude e-mail verstuurd naar ${payload.targetName} @ ${payload.targetCompany}.`);
    console.log(`Status in CRM geüpdatet naar 'Contacted'.`);
    
  } catch (error) {
    console.error("FOUT TIJDENS GENERATIE:", error);
  }
}

testOutreach();
