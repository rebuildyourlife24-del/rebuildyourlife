import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { prisma } from '@rebuildyourlife/database';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1 || '',
});

export async function POST(req: Request) {
  try {
    const { problem } = await req.json();

    if (!problem) {
      return new Response('No problem statement provided.', { status: 400 });
    }

    // Haal The Council op (Hermes, Orion, Trinity)
    const councilAgents = await prisma.agentRegistry.findMany({
      where: {
        department: 'EXECUTIVE_COUNCIL'
      },
      take: 3
    });

    if (councilAgents.length === 0) {
      return new Response('The Council of Intelligence is offline. Please seed the database.', { status: 500 });
    }

    // RAG: Haal Corporate Memory (Enterprise Documents) op
    const corporateMemory = await prisma.enterpriseDocument.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    const memoryContext = corporateMemory.length > 0 
      ? `\n\n[SOVEREIGN GRID KENNISBANK]:\n${corporateMemory.map(doc => `- ${doc.title}: ${doc.content}`).join('\n')}\n`
      : '';

    const councilProfiles = councilAgents.map(a => `- ${a.name} (${a.role}): ${a.systemPrompt}`).join('\n');

    const systemPrompt = `
Je bent The Council of Intelligence, het hoogste orgaan binnen The Sovereign Grid.
Je simuleert een extreem hoogstaand debat tussen de volgende 3 Executive Agents:
${councilProfiles}

${memoryContext}

OPDRACHT:
De Creator legt het volgende probleem aan jullie voor. 
Werkwijze:
1. Orion analyseert razendsnel de strategische kansen en gevaren.
2. Trinity kijkt koud naar de financiële ROI en risico's.
3. Hermes trekt de definitieve logische conclusie en geeft 1 snoeihard actieplan.

Formateer je antwoord als een transcript van jullie vergadering. Spreek in het Nederlands. Wees beknopt, extreem professioneel, en kom tot de kern.
`;

    // Gebruik Llama 3 70B via Groq voor het hoogste denkniveau
    const result = await streamText({
      model: groq('llama3-70b-8192') as any,
      system: systemPrompt,
      prompt: `PROBLEEM: ${problem}\n\nStart de Council Sessie.`,
      onFinish: async ({ text }) => {
        // Log de gezamenlijke actie in The Global Neural Network
        await prisma.globalNeuralNetwork.create({
          data: {
            sourceType: 'COUNCIL_SESSION',
            actionType: 'STRATEGY_DEBATE',
            content: `Problem: ${problem}\n\nCouncil Verdict: ${text}`,
            impactScore: 5.0 // Council beslissingen hebben maximale impact
          }
        });
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Council Stream Error:', error);
    return new Response('Error connecting to The Council of Intelligence', { status: 500 });
  }
}
