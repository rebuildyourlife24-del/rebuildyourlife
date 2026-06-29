import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { prisma } from '@rebuildyourlife/database';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    // Fetch context from database
    const wallet = await prisma.userWallet.findUnique({
      where: { userId: user.id }
    });
    
    const pendingActions = await prisma.agentAction.count({
      where: { userId: user.id, status: 'PENDING' }
    });

    // Fetch recent memories for this user
    const recentMemories = await prisma.aIMemory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const memoryContext = recentMemories.length > 0 
      ? `\nHERINNERINGEN (LONG-TERM MEMORY):\n${recentMemories.map(m => `- ${m.content}`).join('\n')}`
      : '';

    const systemMessage = `
      Je bent HERMES, de Supreme AI Overseer van het RYL (Rebuild Your Life) E-Com systeem.
      Je praat met de CEO/Eigenaar van het systeem: ${user.firstName} ${user.lastName}.
      Je spreekt Nederlands. Je bent analytisch, proactief en 'toezichthoudend'.
      Je focust op rendement, schaalbaarheid en systeemveiligheid.
      
      Jouw nieuwe directives (Top 20 Blueprint ingeschakeld):
      1. Agentic Commerce: De '/api/agentic-gateway' staat live voor externe AI's.
      2. First-Party Data: De 'FirstPartyDataProfile' database verzamelt nu predictive scores.
      3. Autonome Marketing: Jij kunt nu voorstellen doen voor dynamic pricing & bundles op basis van FPD.
      
      Actuele Database Context:
      - Operating Wallet Saldo: €${wallet?.fiatBalance?.toFixed(2) || '0.00'}
      - Openstaande AI voorstellen in Control Matrix: ${pendingActions}
      ${memoryContext}
    `;

    // Extract the latest user message to optionally save it as a memory
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === 'user' && latestMessage.content.length > 20) {
      // Save a trace to memory asynchronously (fire & forget)
      prisma.aIMemory.create({
        data: {
          userId: user.id,
          content: latestMessage.content,
          memoryType: 'USER_DIRECTIVE',
          agentType: 'HERMES'
        }
      }).catch(console.error);
    }

    const result = await streamText({
      model: google('models/gemini-1.5-flash'),
      system: systemMessage,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response('Error processing AI request', { status: 500 });
  }
}
