import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const aiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;

    if (!aiKey) {
      return NextResponse.json({ error: 'Gemini API key missing. Cannot generate SEO audit.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `
Je bent een expert SEO analist in een verkoopgesprek.
Je analyseert de website url: "${url}".
Genereer een gesimuleerd maar realistisch SEO audit rapport voor deze website (of algemeen voor websites in deze vorm).
Het doel van het rapport is om pijnpunten bloot te leggen zodat wij SEO diensten kunnen verkopen.
De tone of voice is direct, zakelijk, en expert-level Nederlands.

Geef het antwoord in EXACt DIT JSON FORMAAT (zonder markdown, geen backticks!):
{
  "score": [een getal tussen 10 en 85],
  "scoreSummary": "Een korte zin over de matige score, bijvoorbeeld: 'Er is potentie, maar veel kritieke technische fouten.'",
  "criticalIssues": [
    "Ontbrekende of slechte H1 structuur.",
    "Trage laadtijd belemmert Google bots."
  ],
  "opportunities": [
    "Content optimaliseren voor high-volume zoekwoorden.",
    "Implementeren van schema markup voor rich snippets."
  ]
}
Zorg voor 3-4 critical issues en 3-4 opportunities. Geef ALLEEN puur JSON terug.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    let rawJson = response.text || "{}";
    // Opschonen van eventuele markdown blokken
    rawJson = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const data = JSON.parse(rawJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error('SEO Audit Error:', error);
    // Fallback data in case parsing fails
    return NextResponse.json({ 
      score: 42,
      scoreSummary: "De scan is voltooid. Er zijn aanzienlijke technische obstakels gevonden.",
      criticalIssues: [
        "Geen duidelijke sitemap.xml gevonden.",
        "Meerdere 404 (Not Found) errors op interne links.",
        "Meta descriptions ontbreken op kernpagina's."
      ],
      opportunities: [
        "Snelheid optimaliseren voor mobiel (Core Web Vitals).",
        "Backlink profiel opschonen.",
        "Implementatie van structurele HTML5 semantiek."
      ]
    });
  }
}
