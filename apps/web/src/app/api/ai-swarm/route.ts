import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { prisma } from '@rebuildyourlife/database';

// Initialize Groq provider
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1 || '',
});

export async function POST(req: Request) {
  try {
    const { agentId, prompt } = await req.json();

    const agent = await prisma.agentRegistry.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      return new Response('Agent not found', { status: 404 });
    }

    const systemPrompt = `
Je bent een autonome agent werkzaam binnen The Sovereign Grid (Rebuild Your Life).
Identiteit: ${agent.name}
Rol: ${agent.role}
Departement: ${agent.department}
Kern Richtlijn: ${agent.systemPrompt}

Je spreekt altijd Nederlands en je spreekt de gebruiker aan met "Creator" of "Baas". 
Wees direct, bondig en resultaatgericht. Geef geen introducties zoals "Hier is het antwoord:"
`;

    // Gebruik Llama 3 via Groq voor belachelijk snelle streaming
    const result = await streamText({
      model: groq('llama3-8b-8192'),
      system: systemPrompt,
      prompt: prompt,
      onFinish: async ({ text }) => {
        // Sla de actie op in de database nadat streaming klaar is
        await prisma.agentTask.create({
          data: {
            agentId: agent.id,
            sourceType: 'MANUAL_DELEGATION',
            actionType: 'EXECUTION',
            content: `Instruction: ${prompt}\n\nResult: ${text}`,
            impactScore: 1.0
          }
        });
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('AI Stream Error:', error);
    return new Response('Error connecting to Neural Swarm', { status: 500 });
  }
}
