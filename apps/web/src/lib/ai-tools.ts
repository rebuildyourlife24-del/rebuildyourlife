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
        // Simpele tag-stripper om tokens te besparen
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
        // We slaan dit voor nu op als een HermesPrediction, wat als een actie in het dashboard verschijnt
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

      default:
        return `Error: Tool '${name}' is niet gevonden in de registry.`;
    }
  } catch (error: any) {
    console.error(`[AI TOOLS] Error in ${name}:`, error.message);
    return `Error executing tool: ${error.message}`;
  }
}
