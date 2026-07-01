import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { niche } = await req.json();

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 });
    }

    // Initialize Google provider using the first available Gemini API key from environment
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // Gebruik OpenAI om gestructureerde data (een JSON rapport) te genereren
    const result = await generateObject({
      model: google('models/gemini-1.5-pro-latest'),
      schema: z.object({
        painPoints: z.array(z.string()).describe('De 3 grootste zakelijke of financiële pijnpunten in deze specifieke branche.'),
        suggestedModelName: z.string().describe('De naam van het voorgestelde verdienmodel. Kies uit: AI Chatbot Agency, Cold Email Outreach, SEO Audit Tool, AI Social Media Agency, One-Pager Service, Digital Product Store, Online Cursus Platform, Betaalde Online Community, Geautomatiseerde Nieuwsbrief, of Drop-servicing Portal.'),
        suggestedModelDescription: z.string().describe('Een korte, krachtige uitleg (pitch) waarom dit specifieke model de pijnpunten van de branche oplost.'),
        applicabilityPlan: z.array(z.object({
          title: z.string(),
          description: z.string()
        })).describe('Een concreet 3-stappenplan om dit model direct toe te passen en te verkopen in deze branche.')
      }),
      prompt: `Analyseer de volgende branche/niche: "${niche}". 
      Identificeer de inefficiënties en pijnpunten. Selecteer het meest winstgevende, geautomatiseerde B2B of B2C verdienmodel dat direct via een SaaS-platform kan worden aangeboden om deze pijnpunten op te lossen.
      Focus op keiharde waarheid en feiten, vermijd abstracte theorieën. Geef een direct toepasbaar actieplan.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[FINDER_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
