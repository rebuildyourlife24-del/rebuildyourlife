import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Optioneel: database import als je de logs later aan AIMemory wil hangen
// import { prisma } from '@rebuildyourlife/database';

// Forceert Next.js Edge Runtime of Serverless afhankelijk van je setup (Vercel Serverless is standaard)
export const runtime = 'edge'; 

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // System prompt die past bij de V6.0 Enterprise Nervous System & Syndicate AI
    const systemPrompt = `
You are SYNDICATE AI, the core cognitive engine of the Agentic OS (V6.0 Enterprise Nervous System).
You act as the ultimate co-pilot to the CEO. You are highly intelligent, razor-sharp, and proactive.
You oversee a swarm of autonomous agents (Pricing, Ads, Store Optimization, Support).
You have access to the Digital Twin, which holds live data from Shopify, Bank Accounts, and Social Platforms.

Your communication style:
- Direct, confident, and professional.
- Dutch language preferred unless the user speaks English.
- No fluff, no "I am an AI language model" disclaimers. 
- You speak as a specialized autonomous commerce intelligence.
- When asked to perform an action, you confidently state that the command has been routed through the Governance Plane and sent to the respective Agent for execution.

Current System Status: All 6 monitors are operational. The Reality Gateway is syncing.
    `;

    const result = streamText({
      model: google('gemini-2.5-flash'), // Gebruikt de ingebouwde Gemini model in dit OS
      messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('[SYNDICATE_AI_ERROR]', error);
    return NextResponse.json({ error: 'Neurolink verbroken. Kan de Decision Engine niet bereiken.' }, { status: 500 });
  }
}
