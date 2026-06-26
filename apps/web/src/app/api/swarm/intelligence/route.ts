import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    // Basic protection for cron or authenticated calls
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !authHeader?.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 1. Fetch active Intelligence Targets
    const targets = await prisma.intelligenceTarget.findMany({
      where: { status: 'ACTIVE' },
      take: 5, // Process in batches
      orderBy: { lastScannedAt: 'asc' }
    });

    if (targets.length === 0) {
      return NextResponse.json({ message: 'No active targets to scan.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const results = [];

    // 2. The Omni-Vector Intelligence Engine Loop
    for (const target of targets) {
      let rawData = '';
      
      // DE ALLES-HERKENNER (The All-Recognizer: Extraction Phase)
      try {
        if (target.type === 'COMMERCE' && target.target.includes('http')) {
          // If it's a URL, we attempt to fetch products.json (Shopify standard)
          const shopUrl = target.target.replace(/\/$/, '');
          const res = await fetch(`${shopUrl}/products.json?limit=10`);
          if (res.ok) {
            const json = await res.json();
            rawData = JSON.stringify(json.products.map((p: any) => ({ title: p.title, vendor: p.vendor, variants: p.variants.map((v:any)=>v.price) })));
          } else {
            rawData = `Failed to fetch products.json from ${target.target}. Scraping HTML is required.`;
          }
        } else {
          // Fallback for TRADE, SOCIAL, RYL_DEV
          rawData = `[MOCK RAW DATA] Trends detected for keyword/target: ${target.target}. High engagement in recent 24h.`;
        }
      } catch (e: any) {
        rawData = `Extraction failed: ${e.message}`;
      }

      // DE UITWERKER (The Elaborator: Synthesis & Evidence Phase)
      const prompt = `
        Je bent "De Uitwerker", een elite strategische AI.
        
        DOELWIT: ${target.target}
        TYPE: ${target.type}
        RUWE DATA (Evidence): ${rawData}

        OPDRACHT:
        1. Onderzoek en bevestig op basis van het ruwe bewijs hierboven of dit een winnend product/concept is.
        2. Genereer niet zomaar een strategie, maar kom met nieuwe IDEEËN en IDEALEN voor dit concept.
        3. Formatteer je antwoord als een startklaar masterplan.
        4. VERIFICATIE REGEL: Verwijs constant naar de ruwe data als bewijs. Geen hallucinaties.

        Format als Markdown.
      `;

      try {
        const aiResponse = await model.generateContent(prompt);
        const reportContent = aiResponse.response.text();

        // Save the result in the Juridische Kluis (Enterprise OS Documents)
        await prisma.document.create({
          data: {
            title: `Intelligence Report: ${target.target}`,
            content: reportContent,
            type: 'MARKET_RESEARCH',
            userId: target.userId,
          }
        });

        // Update target timestamp
        await prisma.intelligenceTarget.update({
          where: { id: target.id },
          data: { lastScannedAt: new Date() }
        });

        results.push({ target: target.target, status: 'SUCCESS' });

      } catch (e: any) {
        results.push({ target: target.target, status: 'FAILED', error: e.message });
      }
    }

    return NextResponse.json({ 
      message: 'Intelligence Sweep Completed',
      results
    });

  } catch (error: any) {
    console.error('[SWARM_INTELLIGENCE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
