import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : 'https://' + url;
    let pageTitle = 'Niet gevonden';
    let pageH1s: string[] = [];
    let metaDescription = 'Niet gevonden';
    let textContent = '';

    // 1. Scrape the actual website
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const res = await fetch(targetUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      pageTitle = $('title').text() || 'Geen title tag gevonden';
      $('h1').each((_, el) => {
        pageH1s.push($(el).text().trim());
      });
      metaDescription = $('meta[name="description"]').attr('content') || 'Geen meta description gevonden';
      
      // Get some basic body text for context (limit to 1000 chars)
      $('script, style, nav, footer, iframe, img').remove();
      textContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 1000);
      
    } catch (scrapeError: any) {
      console.warn("Scraping failed, but continuing with AI analysis:", scrapeError.message);
      return NextResponse.json({ 
        error: `Kan de website niet uitlezen (${scrapeError.message}). Mogelijk blokkeert de site bots.`,
        status: 422
      }, { status: 422 });
    }

    // 2. Feed REAL data to Gemini
    const aiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;

    if (!aiKey) {
      return NextResponse.json({ error: 'Gemini API key missing.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `
Je bent een expert SEO analist in een verkoopgesprek.
We hebben zojuist de website "${targetUrl}" live uitgelezen. Dit zijn de HARDE FEITEN uit de broncode:

- Title Tag: "${pageTitle}"
- Meta Description: "${metaDescription}"
- H1 Tags (${pageH1s.length}): ${pageH1s.length > 0 ? pageH1s.join(' | ') : 'GEEN H1 GEVONDEN'}
- Eerste stuk tekst op pagina: "${textContent}"

Analyseer deze specifieke data genadeloos. Als de title tag slecht is, zeg het. Als de H1 ontbreekt, val ze daarop aan.
Het doel is om pijnpunten bloot te leggen zodat wij SEO diensten kunnen verkopen. De tone of voice is direct, zakelijk, en expert-level Nederlands.

Geef het antwoord in EXACT DIT JSON FORMAAT (zonder markdown, geen backticks!):
{
  "score": [een getal tussen 10 en 85 gebaseerd op deze echte data],
  "scoreSummary": "Een korte zin over de score, bijvoorbeeld: 'De H1 ontbreekt en de title tag is niet geoptimaliseerd.'",
  "criticalIssues": [
    "Jouw analyse van de title tag / h1 / meta description",
    "..."
  ],
  "opportunities": [
    "Wat ze moeten doen om dit op te lossen",
    "..."
  ]
}
Zorg voor 3 critical issues en 3 opportunities op basis van DEZE SPECIFIEKE DATA. Geef ALLEEN puur JSON terug.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for factual analysis
      }
    });

    let rawJson = response.text || "{}";
    rawJson = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const data = JSON.parse(rawJson);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('SEO Audit Error:', error);
    return NextResponse.json({ error: 'Interne serverfout tijdens het genereren van het rapport.', details: error.message }, { status: 500 });
  }
}
