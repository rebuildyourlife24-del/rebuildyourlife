import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database'; // Aanname van de db import in deze monorepo

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, botId } = body;

    if (!botId) {
      return NextResponse.json({ error: 'Missing botId' }, { status: 400 });
    }

    // In een echte productie-omgeving halen we hier de configuratie (prompt) op uit de database
    // const module = await prisma.userBusinessModule.findUnique({ where: { id: botId } });
    // const config = JSON.parse(module.config);
    // const systemPrompt = config.prompt;

    // Fallback/Demo system prompt
    const systemPrompt = "Je bent een uiterst behulpzame AI-assistent. Beantwoord vragen kort, professioneel en klantvriendelijk. Als je het antwoord niet weet, vraag je de bezoeker om hun e-mailadres achter te laten.";

    // Initialize Groq provider using the first available API key from environment
    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY,
    });

    // Gebruik de AI SDK om een streaming response te genereren via Groq (Llama 3) voor extreme snelheid
    const result = await streamText({
      model: groq('llama3-70b-8192') as any,
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[CHATBOT_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
