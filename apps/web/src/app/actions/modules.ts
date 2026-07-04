import { routeAIRequest } from '@/lib/ai-router';

export async function generateWebsiteAction(topic: string, targetAudience: string) {
  try {
    const prompt = `
Je bent een expert web developer en copywriter voor the Syndicate.
Genereer een volledige HTML5 landingspagina (één enkel bestand met Tailwind CSS via CDN) voor een bedrijf met het volgende product/dienst: "${topic}".
De doelgroep is: "${targetAudience}".

Vereisten voor het design (Cyberpunk / Modern Donker thema):
- Achtergrond: Pikzwart (#020202) of donkergrijs.
- Primaire accentkleur: Fuchsia/Paars (neon-achtige gloed).
- Font: Inter (via sans-serif fallback).
- Tailwind CSS klassen gebruiken voor styling.
- Voeg in de styling wat neon-text en neon-border CSS toe in een <style> tag.
- Geen markdown blockticks (\`\`\`html), stuur ALLEEN pure HTML code terug!

De structuur moet bevatten:
1. Een navigatiebalk met bedrijfsnaam en een Call to Action knop.
2. Een hero sectie met een ijzersterke headline die inspeelt op de doelgroep, en een sub-headline over automatisering/winst.
3. Een sectie met 3 USP's (Unique Selling Points) in kaarten (cards) met een lichte neon rand.
4. Een minimalistische footer.

Zorg dat de teksten overtuigend zijn en exact passen bij "${topic}" en "${targetAudience}".
Stuur uitsluitend HTML code terug.
`;

    const response = await routeAIRequest([{ role: 'user', content: prompt }]);

    // Remove any markdown formatting if the AI still included it
    let html = response.content.replace(/\`\`\`html/gi, '').replace(/\`\`\`/g, '').trim();

    return { success: true, html };
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return { success: false, error: "Kon de website niet genereren met AI." };
  }
}

export async function generateColdEmailAction(topic: string, targetAudience: string) {
  try {
    const prompt = `
Je bent een elite copywriter in B2B sales.
Genereer een 3-staps cold email funnel (in het Nederlands) voor het verkopen van: "${topic}" aan de doelgroep: "${targetAudience}".

Vereisten:
- Gebruik the Sovereign Grid methodologie (direct, scherp, hyper-relevant, geen overbodige beleefdheden).
- Stap 1: Korte introductie & de hook.
- Stap 2: Waarde leveren (case study of ROI-rekenvoorbeeld).
- Stap 3: De break-up / laatste kans.

Geef je antwoord EXACT in het volgende JSON-formaat terug. Let op, retourneer ALLEEN de JSON. Geen inleidende of afsluitende tekst.

[
  {
    "step": 1,
    "subject": "onderwerp e-mail 1",
    "body": "tekst e-mail 1"
  },
  {
    "step": 2,
    "subject": "onderwerp e-mail 2",
    "body": "tekst e-mail 2"
  },
  {
    "step": 3,
    "subject": "onderwerp e-mail 3",
    "body": "tekst e-mail 3"
  }
]
`;

    const response = await routeAIRequest([{ role: 'user', content: prompt }]);
    
    // Clean up potential markdown formatting from AI output
    const jsonString = response.content.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    
    const sequence = JSON.parse(jsonString);

    return { success: true, sequence };
  } catch (error: any) {
    console.error("Cold Email Generation error:", error);
    return { success: false, error: "Kon de e-mail flow niet genereren met AI." };
  }
}

export async function generateViralScriptAction(topic: string, platform: string) {
  try {
    const prompt = `
Je bent een virale social media expert.
Schrijf een extreem boeiend, controversieel of hoog-converterend script voor een korte video op ${platform} over het onderwerp: "${topic}".

Structuur:
1. De HOOK (Eerste 3 seconden, moet direct de aandacht grijpen).
2. De BODY (Waarde leveren of een paradigma doorbreken, vlot en krachtig).
3. De CTA (Call to Action).

Geef het script terug in een overzichtelijk format. Géén markdown JSON, gewoon tekst.
`;
    const response = await routeAIRequest([{ role: 'user', content: prompt }]);
    return { success: true, script: response.content.trim() };
  } catch (error: any) {
    console.error("Viral Script error:", error);
    return { success: false, error: "Kon script niet genereren." };
  }
}

export async function generateSEOReportAction(url: string, contextData?: string) {
  try {
    const prompt = `
Je bent een meedogenloze technische SEO expert.
Maak een harde, feitelijke SEO audit voor de volgende website/onderwerp: "${url}".
${contextData ? `Extra context van de scraper:\n${contextData}\n\n` : ""}

Je MOET je antwoord EXACT formatteren als onderstaande JSON, geen andere tekst of markdown ticks.

{
  "score": 45,
  "scoreSummary": "Kritieke problemen ontdekt. Onmiddellijke actie vereist.",
  "criticalIssues": [
    "Geen H1 tag gevonden op de homepage.",
    "Lage Core Web Vitals (LCP > 4.5s)."
  ],
  "opportunities": [
    "Optimaliseer afbeeldingen voor snellere laadtijd.",
    "Implementeer schema markup voor lokale SEO."
  ]
}
`;
    const response = await routeAIRequest([{ role: 'user', content: prompt }]);
    const cleanJson = response.content.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    return { success: true, report: JSON.parse(cleanJson) };
  } catch (error: any) {
    console.error("SEO Audit error:", error);
    return { success: false, error: "Kon audit niet genereren." };
  }
}

export async function generateNewsletterAction(topic: string, format: string) {
  try {
    const prompt = `
Je bent een meester in e-mail marketing (The Syndicate).
Schrijf een nieuwsbrief editie over het onderwerp: "${topic}".
Format/Stijl: "${format}".

Zorg dat de nieuwsbrief boeiend is, extremiteit niet schuwt en veel waarde levert.
Gebruik the Sovereign Grid principes: Geen fluff, maximale hefboom, duidelijke call to actions.
Geef het terug als tekst/markdown.
`;
    const response = await routeAIRequest([{ role: 'user', content: prompt }]);
    return { success: true, newsletter: response.content.trim() };
  } catch (error: any) {
    console.error("Newsletter error:", error);
    return { success: false, error: "Kon nieuwsbrief niet genereren." };
  }
}

export async function trainChatbotAction(businessName: string, rules: string) {
  try {
    const prompt = `
Je bent een AI Engineer voor The Syndicate.
Genereer een complete "System Prompt" en set instructies voor een klantenservice chatbot voor het bedrijf: "${businessName}".

De specifieke regels die de bot moet volgen zijn:
"${rules}"

Genereer een gedetailleerde prompt die we direct kunnen inladen in een custom LLM voor deze klant. Inclusief persoonlijkheid, wat de bot wél mag, wat hij absoluut NIET mag, en hoe hij leads moet afvangen.
`;
    const response = await routeAIRequest([{ role: 'user', content: prompt }]);
    return { success: true, prompt: response.content.trim() };
  } catch (error: any) {
    console.error("Chatbot training error:", error);
    return { success: false, error: "Kon chatbot prompt niet genereren." };
  }
}
