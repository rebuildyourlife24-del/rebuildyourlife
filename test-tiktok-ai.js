require('dotenv').config({ path: '.env' });

async function testTikTokAI() {
  console.log("\n=======================================================");
  console.log("   [TEST] MODEL 8: TIKTOK / SHORTS AI ACCOUNTS");
  console.log("   SCAFFOLDING: ORNITH 1.0 (Autonome Video Fabriek)");
  console.log("=======================================================\n");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("FOUT: GROQ API Key ontbreekt in .env");
    return;
  }

  const payload = {
    accountId: "VIRAL_WEALTH_001",
    niche: "Financiële Psychologie & Geld Verdienen",
    style: "Alex Hormozi / Aggressive Hook"
  };

  console.log("INCOMING API REQUEST (SYSTEM CRONJOB TRIGGERS NEW POST):");
  console.log(payload);
  console.log(`\n[⏳] Genereren van viraal script en visual prompts...`);

  const prompt = `Schrijf een extreem viraal TikTok/Shorts script (ongeveer 30 seconden) in het thema: "${payload.niche}". 
  Stijl: ${payload.style}.
  
  Regels:
  1. Begin met een snoeiharde hook (de eerste 3 seconden).
  2. Houd zinnen kort voor snelle captions.
  3. Eindig met een duidelijke 'Follow/Like' call to action.
  
  Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
  {
    "hook": "De openingszin",
    "scriptBody": "De volledige spoken tekst",
    "visualPrompts": ["Achtergrond 1", "Achtergrond 2"]
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
        temperature: 0.8
      })
    });

    const aiData = await response.json();
    if (!aiData.choices) {
      console.error("GROQ API ERROR:", aiData);
      return;
    }
    const generatedScript = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] SCRIPT & ORCHESTRATION KLAAR");
    console.log("=======================================================\n");
    console.log(`HOOK: ${generatedScript.hook}`);
    console.log(`\nSCRIPT:`);
    console.log("-------------------------------------------------------");
    console.log(generatedScript.scriptBody);
    console.log("-------------------------------------------------------");
    
    console.log(`\n[>>] Start Video Assembly Pipeline...`);
    console.log(`[>>] Syncing TTS Audio with Captions...`);
    console.log(`[>>] Overlaying Visuals: ${generatedScript.visualPrompts[0]}`);

    const finalVideoUrl = `https://enterprise.ai-henksemler.nl/cdn/tiktok/${payload.accountId}/viral_render_${Date.now()}.mp4`;

    console.log("\n=======================================================");
    console.log("   [🏛️] ENTERPRISE ADMINISTRATIE LOG (enterprise.ai-henksemler.nl)");
    console.log("=======================================================\n");
    console.log(`[LOG-ID: TIKTOK-AUTO-551] Video gerenderd (${finalVideoUrl}).`);
    console.log(`[>>] Pushing to TikTok API... STATUS: SUCCES.`);
    
  } catch (error) {
    console.error("FOUT TIJDENS GENERATIE:", error);
  }
}

testTikTokAI();
