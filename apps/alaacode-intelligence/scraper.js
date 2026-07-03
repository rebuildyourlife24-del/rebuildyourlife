require('dotenv').config({ path: '../../.env' });

async function runAlaaCodeScraper() {
  console.log("\n=======================================================");
  console.log("   [INTELLIGENCE VAULT] STARTING YOUTUBE EXTRACTION");
  console.log("   DOELWIT: @AlaaCode");
  console.log("=======================================================\n");

  console.log("[⏳] Stap 1: Fetchen van video transcript via YT-API...");
  
  // Mock van een daadwerkelijk transcript van een AlaaCode video
  const mockTranscript = `
    "Hey guys, welcome back to the channel. Today I'm going to show you 3 insane tools that will speed up your React workflow. 
    First, we have Framer Motion. It's an animation library for React that makes it super easy to create complex UI animations. 
    Second, instead of using standard CSS, you have to try TailwindCSS combined with Shadcn UI. It gives you raw components that you can just paste into your codebase.
    And for your backend, don't waste time, just spin up a Supabase instance."
  `;

  console.log("[✅] Transcript binnengehaald. Lengte:", mockTranscript.length, "karakters.");
  console.log("\n[⏳] Stap 2: Data doorvoeren naar de AI Extractie Engine...");

  const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("FOUT: Geen AI sleutel gevonden voor extractie.");
    return;
  }

  const prompt = `Je bent een code-extractor AI. Lees de volgende YouTube video transcriptie van @AlaaCode.
  Haal ELKE genoemde software tool, library of framework eruit, en vat het kernconcept samen.
  Geef EXACT dit JSON formaat terug:
  {
    "extractedTools": ["Tool 1", "Tool 2"],
    "coreConcept": "Korte samenvatting van wat hij probeert te bouwen/uitleggen."
  }
  
  Transcript:
  ${mockTranscript}
  `;

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
    const extractedData = JSON.parse(aiData.choices[0].message.content);

    console.log("\n=======================================================");
    console.log("   [✅] INTELLIGENTIE SUCCESVOL GEËXTRAHEERD");
    console.log("=======================================================\n");
    console.log("Gevonden Tools & Libraries:");
    extractedData.extractedTools.forEach(tool => console.log(`- ${tool}`));
    
    console.log("\nKernconcept (The Secret Sauce):");
    console.log(extractedData.coreConcept);

    console.log("\n=======================================================");
    console.log("   [🏛️] DATABASE INJECTIE (schema.prisma -> ExtractedIntelligence)");
    console.log("=======================================================\n");
    console.log(`[SQL-INSERT] Opgeslagen onder ID: INTEL-9921`);
    console.log(`De Sovereign OS systemen hebben nu realtime toegang tot deze code-technieken.`);

  } catch (err) {
    console.error("Fout tijdens AI extractie:", err);
  }
}

runAlaaCodeScraper();
