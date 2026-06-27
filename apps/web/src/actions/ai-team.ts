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

    // LOCAL OLLAMA INFERENCE (Llama)
    try {
      // Trying local Ollama default port 11434
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3', // Default to a popular Llama model, can be configured via env var
          prompt: prompt,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        responseText = data.response;
      } else {
        throw new Error(`Ollama API responded with status ${response.status}`);
      }
    } catch (localErr: any) {
      console.warn("Local Llama connection failed:", localErr.message);
      // Fallback response if local AI is unreachable
      return { 
        success: false, 
        message: `SYSTEM ERROR: Kan niet verbinden met de lokale Llama AI (Ollama). Zorg ervoor dat je local AI op localhost:11434 draait. Foutmelding: ${localErr.message}` 
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
