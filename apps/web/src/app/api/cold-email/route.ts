import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { niche: targetUrl, pitch } = await req.json(); // We repurposed 'niche' as 'targetUrl' in the UI state for now

    if (!targetUrl || !pitch) {
      return NextResponse.json({ error: 'Target URL en pitch zijn vereist' }, { status: 400 });
    }

    const formattedUrl = targetUrl.startsWith('http') ? targetUrl : 'https://' + targetUrl;
    let pageTitle = 'Onbekend';
    let textContent = '';
    let companyName = targetUrl.replace(/^https?:\/\//, '').split('/')[0];

    // 1. Scrape the actual website
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const res = await fetch(formattedUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        pageTitle = $('title').text() || companyName;
        
        // Try to get a sensible company name
        const ogSiteName = $('meta[property="og:site_name"]').attr('content');
        if (ogSiteName) companyName = ogSiteName;
        
        // Get some basic body text for context (limit to 1500 chars)
        $('script, style, nav, footer, iframe, img, noscript').remove();
        textContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 1500);
      }
    } catch (scrapeError: any) {
      console.warn("Cold Email Scraping failed, will rely on domain name:", scrapeError.message);
      // We continue even if scraping fails, relying on the domain name.
    }

    const aiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;

    if (!aiKey) {
      return NextResponse.json({ error: 'Gemini API key missing. Cannot generate leads.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `
Je bent een meedogenloze, extreem succesvolle B2B copywriter gespecialiseerd in cold outreach.
Jouw taak is om EEN hyper-gepersonaliseerde koude e-mail te schrijven naar de directie van een specifiek bedrijf.

Doelwit Bedrijf: "${companyName}"
Website URL: "${formattedUrl}"
Pagina Titel van hun website: "${pageTitle}"
Gescrapete tekst van hun website (gebruik dit voor personalisatie): "${textContent}"

Jouw Propositie (wat we ze verkopen): "${pitch}"

Schrijf de perfecte, korte cold email. 
Regels:
1. Geen "Beste heer/mevrouw" onzin. Begin direct en zakelijk, bijv. "Hoi team van [Bedrijf]" of "Hi [Voornaam]" (als je een naam kunt afleiden, anders bedrijfsnaam).
2. Verwijs in de EERSTE zin direct naar iets specifieks wat ze doen (gebaseerd op de gescrapete tekst). Bewijs dat je hun site hebt bekeken.
3. Maak de brug naar onze propositie ("${pitch}").
4. Sluit af met een zachte Call to Action (bijv: "Open voor een chat van 5 min hierover?").
5. Zorg dat de mail maximaal 4 korte zinnen is.

Geef het antwoord in EXACT DIT JSON FORMAAT (zonder markdown, geen backticks!):
{
  "leads": [
    {
      "companyName": "[De naam van het bedrijf]",
      "email": "directie@[domein].nl",
      "personalizedPitch": "[Jouw meesterlijke koude email hier]"
    }
  ]
}
Geef ALLEEN puur JSON terug.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    });

    let rawJson = response.text || "{}";
    rawJson = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const data = JSON.parse(rawJson);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Cold Email Error:', error);
    return NextResponse.json({ error: 'Interne serverfout tijdens het genereren van de email.', details: error.message }, { status: 500 });
  }
}
