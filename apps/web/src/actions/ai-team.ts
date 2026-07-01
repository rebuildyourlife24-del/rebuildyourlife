'use server';

import { prisma } from '@rebuildyourlife/database';

export async function getAgents() {
  return prisma.agentRegistry.findMany({
    orderBy: { agentNumber: 'asc' }
  });
}

export async function updateAgent(agentId: string, data: any) {
  try {
    await prisma.agentRegistry.update({
      where: { id: agentId },
      data: {
        name: data.name,
        role: data.role,
        department: data.department,
        systemPrompt: data.systemPrompt
      }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function delegateTask(agentId: string, instruction: string) {
  try {
    const agent = await prisma.agentRegistry.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      return { success: false, message: 'Agent not found.' };
    }

    const prompt = `
Je bent een autonome agent werkzaam binnen The Sovereign Grid (Rebuild Your Life).
Identiteit: ${agent.name}
Rol: ${agent.role}
Departement: ${agent.department}
Kern Richtlijn: ${agent.systemPrompt}

Taak van de CEO:
"${instruction}"

Voer de taak direct uit. Geef ALLEEN het resultaat van je werk. Geef geen introducties, geen meta-commentaar. Spreek direct als de agent.
    `;

    let responseText = "";

    try {
      const groqKey = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1;
      
      if (groqKey) {
        const { createGroq } = await import('@ai-sdk/groq');
        const { generateText } = await import('ai');
        const groq = createGroq({ apiKey: groqKey });
        
        const result = await generateText({
          model: groq('llama3-8b-8192') as any,
          prompt: prompt,
        });
        
        responseText = result.text;
      } else {
        // Fallback als er geen API key is
        return { 
          success: false, 
          message: `SYSTEM ERROR: Geen GROQ_API_KEY gevonden in de Vercel environment. Configureer de API key om de AI Swarm in de cloud te activeren.` 
        };
      }
    } catch (apiErr: any) {
      console.warn("Cloud AI connection failed:", apiErr.message);
      return { 
        success: false, 
        message: `SYSTEM ERROR: Kan niet verbinden met de Cloud AI (Groq). Foutmelding: ${apiErr.message}` 
      };
    }

    // Log the task execution
    await (prisma as any).agentTask.create({
      data: {
        agentId: agent.id,
        sourceType: 'MANUAL_DELEGATION',
        actionType: 'EXECUTION',
        content: `Instruction: ${instruction}\n\nResult: ${responseText}`,
        impactScore: 1.0
      }
    });

    return { success: true, message: responseText };
  } catch (error: any) {
    console.error('Agent execution error:', error);
    return { success: false, message: `System Error: ${error.message}` };
  }
}
