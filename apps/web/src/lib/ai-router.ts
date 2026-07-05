/**
 * THE SOVEREIGN AI ROUTER
 * Automatisch schakelen tussen meerdere AI providers en API keys.
 * Inclusief Agentic Loop (Tools) en de Universal Memory Matrix (RAG).
 */
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/db';
import { systemTools, executeToolCall } from './ai-tools';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
}

interface AIProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  priority: number;
}

// Providers in volgorde van prioriteit (meest genereus eerst)
function getProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  // --- CEREBRAS ---
  const cerebrasKeys = [
    process.env.CEREBRAS_API_KEY_1,
    process.env.CEREBRAS_API_KEY_2,
    process.env.CEREBRAS_API_KEY_3,
  ].filter(Boolean) as string[];

  cerebrasKeys.forEach((key, i) => {
    providers.push({
      name: `Cerebras-${i + 1}`,
      baseUrl: 'https://api.cerebras.ai/v1',
      apiKey: key,
      model: 'llama3.1-70b',
      priority: 1,
    });
  });

  // --- GROQ ---
  const groqKeys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY, 
  ].filter(Boolean) as string[];

  const uniqueGroqKeys = [...new Set(groqKeys)];

  uniqueGroqKeys.forEach((key, i) => {
    providers.push({
      name: `Groq-Llama3.3-${i + 1}`,
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: key,
      model: 'llama-3.3-70b-versatile',
      priority: 2,
    });
    providers.push({
      name: `Groq-Mixtral-${i + 1}`,
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: key,
      model: 'mixtral-8x7b-32768',
      priority: 3,
    });
  });

  // --- GOOGLE GEMINI ---
  const geminiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  ].filter(Boolean) as string[];

  const uniqueGeminiKeys = [...new Set(geminiKeys)];

  uniqueGeminiKeys.forEach((key, i) => {
    providers.push({
      name: `Gemini-Flash-${i + 1}`,
      baseUrl: 'google-genai-sdk',
      apiKey: key,
      model: 'gemini-2.5-flash',
      priority: 4,
    });
  });

  // --- OPENROUTER ---
  if (process.env.OPENROUTER_API_KEY) {
    const orKey = process.env.OPENROUTER_API_KEY;
    providers.push({
      name: 'OpenRouter-Hermes',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: orKey,
      model: 'nousresearch/hermes-3-llama-3.1-8b:free',
      priority: 5,
    });
  }

  return providers.sort((a, b) => a.priority - b.priority);
}

/**
 * Functie om de Universele Geheugen Matrix te injecteren
 */
async function injectUniversalMemory(messages: AIMessage[], systemPrompt: string): Promise<string> {
  try {
    // We pakken de laatste user message om context te bepalen
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const keywords = lastUserMessage.toLowerCase().split(' ').filter(w => w.length > 4);
    
    if (keywords.length === 0) return systemPrompt;

    const orConditions = keywords.map(kw => ({ evidence: { contains: kw, mode: 'insensitive' } }));
    
    // Haal relevante feiten op voor ALLE agents
    const relevantDocs = await db.agentKnowledgeBase.findMany({
      where: {
        status: 'ACTIVE',
        OR: orConditions as any
      },
      take: 2 
    });

    if (relevantDocs.length > 0) {
      let injectedKnowledge = '\n\n[SYSTEM INSTRUCTION: UNIVERSAL MEMORY MATRIX]\nGebruik de volgende geverifieerde feiten uit de database als absolute waarheid voor je antwoord:\n';
      relevantDocs.forEach(doc => {
        const snippet = doc.evidence ? doc.evidence.substring(0, 5000) : '';
        injectedKnowledge += `\nDOCUMENT: ${doc.claim}\n${snippet}...\n`;
      });
      return systemPrompt + injectedKnowledge;
    }
  } catch (err) {
    console.error('[MEMORY INJECTOR] Error fetching memory:', err);
  }
  
  return systemPrompt;
}

/**
 * Stuur een bericht naar de AI. Het systeem probeert automatisch alle
 * geconfigureerde providers, in volgorde van prioriteit, en beheert de Agentic Loop.
 */
export async function routeAIRequest(
  originalMessages: AIMessage[],
  baseSystemPrompt: string = 'Je bent een AI assistent.',
  options: { preferredModel?: string } = {}
): Promise<AIResponse> {
  const providers = getProviders();

  if (providers.length === 0) {
    throw new Error('Geen AI providers geconfigureerd. Voeg API keys toe aan je .env bestand.');
  }

  // 1. Injecteer de Universele Geheugen Matrix (RAG)
  const systemPrompt = await injectUniversalMemory(originalMessages, baseSystemPrompt);
  
  // 2. Prepareer de berichten
  let conversation: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...originalMessages
  ];

  let lastError: Error | null = null;
  
  // Agentic Loop: Maximaal 3 iteraties voor tool calls
  const MAX_ITERATIONS = 3;
  
  for (const provider of providers) {
    // Model Forcing: Skip als er een preferred model is en dit is hem niet (simpele regex check)
    if (options.preferredModel && !provider.name.toLowerCase().includes(options.preferredModel.toLowerCase())) {
      continue;
    }

    try {
      console.log(`[AI ROUTER] Proberen via ${provider.name}...`);
      
      let iteration = 0;
      let isDone = false;
      let finalContent = '';

      while (!isDone && iteration < MAX_ITERATIONS) {
        iteration++;
        
        if (provider.baseUrl === 'google-genai-sdk') {
          // Gemini SDK fallback (nog geen tools geïmplementeerd voor Gemini in deze build)
          const ai = new GoogleGenAI({ apiKey: provider.apiKey });
          const promptString = conversation.map(m => `[${m.role.toUpperCase()}]:\n${m.content}`).join('\n\n');
          
          const response = await ai.models.generateContent({
            model: provider.model,
            contents: promptString,
          });
          
          finalContent = response.text?.trim() || '';
          isDone = true; 
        } else {
          // OpenAI Compatible endpoints (Cerebras, Groq, OpenRouter) MET TOOL CALLING
          const response = await fetch(`${provider.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${provider.apiKey}`,
            },
            body: JSON.stringify({
              model: provider.model,
              messages: conversation,
              tools: systemTools,
              tool_choice: 'auto',
              max_tokens: 3000,
              temperature: 0.7,
            }),
          });

          if (response.status === 429 || response.status >= 500) {
            throw new Error(`Rate limit of server error: ${response.status}`);
          }

          if (!response.ok) {
            throw new Error(await response.text());
          }

          const data = await response.json();
          const message = data.choices?.[0]?.message;
          
          if (!message) {
            throw new Error('Geen message teruggekregen');
          }

          // Controleer of de AI een Tool wil gebruiken
          if (message.tool_calls && message.tool_calls.length > 0) {
            console.log(`[AI ROUTER] 🛠️ Tool call gedetecteerd door ${provider.name}`);
            
            // Voeg de assistent response (met tool calls) toe aan de conversatie
            conversation.push(message);

            // Voer alle tools uit
            for (const toolCall of message.tool_calls) {
              const args = JSON.parse(toolCall.function.arguments);
              const result = await executeToolCall(toolCall.function.name, args);
              
              // Geef het resultaat terug aan de AI
              conversation.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: String(result)
              });
            }
            // Loop gaat verder, AI mag nu het antwoord formuleren op basis van de tool resultaten
          } else {
            // Geen tool calls, we zijn klaar
            finalContent = message.content || '';
            isDone = true;
          }
        }
      }

      console.log(`[AI ROUTER] ✅ Succes via ${provider.name} (Iteraties: ${iteration})`);

      return {
        content: finalContent,
        provider: provider.name,
        model: provider.model,
      };
    } catch (err: any) {
      console.warn(`[AI ROUTER] ❌ ${provider.name} faalde:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(`Alle AI providers gefaald. Laatste fout: ${lastError?.message}`);
}
