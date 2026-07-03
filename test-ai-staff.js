require('dotenv').config({ path: '.env' });

async function testAIStaff() {
  console.log("\n=======================================================");
  console.log("   [TEST] MODEL 4: AI PERSONEEL (RECRUITMENT API)");
  console.log("=======================================================\n");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("FOUT: GROQ API Key ontbreekt in .env");
    return;
  }

  const payload = {
    clientId: "CLIENT_9921",
    companyName: "Vastgoed Verhuur B.V.",
    roleRequested: "Lead Qualification & Booking Agent",
    salaryTier: 299
  };

  console.log("INCOMING API REQUEST (KLANT HUURT AI IN):");
  console.log(payload);
  console.log(`\n[⏳] Initialiseren van de nieuwe virtuele medewerker (Kosten: €${payload.salaryTier}/mnd)...`);

  const prompt = `Je bent de architect van AI-personeel. Een nieuw bedrijf genaamd "${payload.companyName}" heeft zojuist een virtuele werknemer ingehuurd voor de rol van: ${payload.roleRequested}.
    
  Verzin een menselijke naam voor deze AI-medewerker en genereer een ijzersterke System Prompt (instructieset) waarmee deze AI direct aan de slag kan in dat specifieke bedrijf.
  
  Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
  {
    "employeeName": "Kies een professionele naam",
    "systemPrompt": "Je bent [Naam], de [Rol] voor [Bedrijf]. Jouw primaire taak is..."
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
    const provisionedEmployee = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] DIGITALE WERKNEMER GEPROVISIONED EN ONLINE");
    console.log("=======================================================\n");
    console.log(`Naam: ${provisionedEmployee.employeeName}`);
    console.log(`Rol:  ${payload.roleRequested}`);
    console.log(`\nIngeladen Brein (System Prompt):`);
    console.log("-------------------------------------------------------");
    console.log(provisionedEmployee.systemPrompt);
    console.log("-------------------------------------------------------");

    console.log("\n=======================================================");
    console.log("   [🏛️] ENTERPRISE ADMINISTRATIE LOG (enterprise.ai-henksemler.nl)");
    console.log("=======================================================\n");
    console.log(`[LOG-ID: STAFF-992] Abonnement gestart: AI-Personeel (${provisionedEmployee.employeeName}) ingehuurd door ${payload.companyName}.`);
    console.log(`Omzet Toename: €${payload.salaryTier} / maand (Recurring Revenue).`);
    
  } catch (error) {
    console.error("FOUT TIJDENS GENERATIE:", error);
  }
}

testAIStaff();
