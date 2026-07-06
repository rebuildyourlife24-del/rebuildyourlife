import { db } from '@/lib/db'

// ══════════════════════════════════════════════════════════════
// SOVEREIGN AI TOOLS REGISTRY
// Dit bestand bevat de definities en de logica van de tools ("Handen") 
// die alle AI-modellen in het netwerk kunnen gebruiken.
// ══════════════════════════════════════════════════════════════

// 1. JSON Schema Definities voor de LLM's (OpenAI formaat)
export const systemTools = [
  {
    type: 'function',
    function: {
      name: 'scrape_website',
      description: 'Haalt de tekstuele inhoud van een live webpagina op. Gebruik dit om concurrenten te analyseren of externe data te lezen.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'De volledige URL (inclusief https://) van de webpagina.',
          },
        },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_dashboard_metrics',
      description: 'Haalt de actuele statistieken uit de database (zoals het aantal actieve agents, kennisdocumenten).',
      parameters: {
        type: 'object',
        properties: {
          metric_type: {
            type: 'string',
            enum: ['agents', 'knowledge', 'all'],
            description: 'Welk type data je wilt ophalen.',
          },
        },
        required: ['metric_type'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_platform_task',
      description: 'Maakt een nieuwe taak of "Voorspelling" aan in het dashboard van de gebruiker.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Korte titel van de actie of voorspelling.',
          },
          description: {
            type: 'string',
            description: 'Uitgebreide uitleg van de taak.',
          },
          confidence: {
            type: 'number',
            description: 'Zekerheid (0-100) van de AI over deze actie.',
          }
        },
        required: ['title', 'description', 'confidence'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delegate_to_agent',
      description: 'Delegeert asynchroon een complexe taak naar een andere AI agent (binnen de Swarm).',
      parameters: {
        type: 'object',
        properties: {
          targetAgent: {
            type: 'string',
            description: 'De naam of het type van de agent die je wilt aanroepen (bijv. "copy", "cfo", "ecom_seo").',
          },
          taskTitle: {
            type: 'string',
            description: 'Een korte duidelijke titel van de taak.',
          },
          prompt: {
            type: 'string',
            description: 'De volledige instructie voor de ontvangende agent.',
          }
        },
        required: ['targetAgent', 'taskTitle', 'prompt'],
      },
    },
  }
];

// 2. De daadwerkelijke Executie-Logica van de Tools
export async function executeToolCall(name: string, args: Record<string, any>): Promise<string> {
  console.log(`[AI TOOLS] Executing Tool: ${name}`, args)
  
  try {
    switch (name) {
      case 'scrape_website': {
        const { url } = args;
        const res = await fetch(url);
        const html = await res.text();
        const text = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').substring(0, 8000); 
        return `Resultaat van ${url}:\n\n${text}`;
      }
      
      case 'get_dashboard_metrics': {
        const agentCount = await db.agentRegistry.count();
        const knowledgeCount = await db.agentKnowledgeBase.count();
        const predictionsCount = await db.hermesPrediction.count();
        
        return JSON.stringify({
          active_agents: agentCount,
          verified_facts_in_memory: knowledgeCount,
          historical_predictions: predictionsCount,
          status: 'All systems operational'
        });
      }
      
      case 'create_platform_task': {
        const { title, description, confidence } = args;
        const prediction = await db.hermesPrediction.create({
          data: {
            category: 'AUTO_ACTION',
            predictionText: `${title}: ${description}`,
            confidenceScore: confidence,
            suggestedAction: 'Review in Dashboard'
          }
        });
        return `Taak succesvol aangemaakt met ID: ${prediction.id}`;
      }

      case 'delegate_to_agent': {
        const { targetAgent, taskTitle, prompt } = args;
        const { inngest } = await import('./inngest/client');
        
        // Sla de taak op in de database
        const task = await db.aiBountyTask.create({
          data: {
            title: taskTitle,
            description: `Aangeroepen door een agent.\n\nInstructies:\n${prompt}`,
            bountyAmount: 0.0,
            status: "OPEN"
          }
        });

        // Vuur het asynchrone Inngest event af
        await inngest.send({
          name: "agent/task.assigned",
          data: {
            taskId: task.id,
            agentId: targetAgent,
            prompt: prompt
          }
        });

        return `Taak succesvol gedelegeerd naar ${targetAgent} via Inngest (Task ID: ${task.id}). Je hoeft niet te wachten op antwoord, The Syndicate handelt dit asynchroon af op de achtergrond.`;
      }

      default:
        return `Error: Tool '${name}' is niet gevonden in de registry.`;
    }
  } catch (error: any) {
    console.error(`[AI TOOLS] Error in ${name}:`, error.message);
    return `Error executing tool: ${error.message}`;
  }
}
