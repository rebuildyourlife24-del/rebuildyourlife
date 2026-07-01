import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    // 1. Fetch the actual website content (ECHTE DATA)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Ryl-SEO-Bot/1.0',
      },
      // Timeout after 10s to prevent hanging
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(\`Failed to fetch URL: \${response.statusText}\`);
    }

    const html = await response.text();
    
    // We trim the HTML to prevent token overflow, taking the first 40,000 characters 
    // which is more than enough for a homepage's `<head>` and main `<body>` structure.
    const trimmedHtml = html.substring(0, 40000);

    // 2. Initialize Google Gemini 1.5 Pro (De beste reasoning API uit .env)
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // 3. Analyseer de ECHTE HTML data via AI
    const result = await generateObject({
      model: google('models/gemini-1.5-pro-latest'),
      schema: z.object({
        score: z.number().min(0).max(100).describe('Een algemene SEO score van 0 tot 100 gebaseerd op de HTML.'),
        scoreSummary: z.string().describe('Een korte (1 zin) conclusie over deze score.'),
        criticalIssues: z.array(z.string()).describe('Lijst van kritieke, technische SEO-fouten in de HTML (ontbrekende title, geen h1, grote images, etc.)'),
        opportunities: z.array(z.string()).describe('Lijst van kansen om de SEO direct te verbeteren.')
      }),
      prompt: \`Je bent een Senior Technical SEO Expert. Analyseer de volgende ruwe HTML van de website: \${url}.
      
      HTML CONTENT:
      \${trimmedHtml}
      
      Genereer een eerlijk, feitelijk en streng SEO-rapport op basis van de aanwezige HTML structuur. 
      Let specifiek op: meta tags, title tags, heading structuur (H1, H2), image alt-tags, en mobiele responsiveness indicatoren.\`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[SEO_AUDIT_API_ERROR]', error);
    return NextResponse.json({ error: 'Kon website niet analyseren.' }, { status: 500 });
  }
}
