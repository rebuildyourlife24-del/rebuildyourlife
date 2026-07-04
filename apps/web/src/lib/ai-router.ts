/**
 * THE SOVEREIGN AI ROUTER
 * Automatisch schakelen tussen meerdere AI providers en API keys.
 * Als provider 1 een limiet raakt (429), schakelt het systeem automatisch
 * door naar de volgende provider. Volledig transparant voor de rest van de app.
 *
 * Prioriteit: Cerebras -> Groq -> Google Gemini -> OpenRouter (fallback)
 */

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
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
// Providers in volgorde van prioriteit (meest genereus eerst)
function getProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  // --- CEREBRAS (Incredible speed, 1M tokens/dag gratis) ---
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
      model: 'llama3.1-70b', // Fixed model name
      priority: 1,
    });
  });

  // --- GROQ (Zeer snel, genereuze gratis tier) ---
  const groqKeys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY, // also check default
  ].filter(Boolean) as string[];

  // Unieke keys filteren
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

  // --- GOOGLE GEMINI (Zeer slim, veel gratis reqs) ---
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
      baseUrl: 'google-genai-sdk', // special flag for SDK
      apiKey: key,
      model: 'gemini-2.5-flash',
      priority: 4,
    });
  });

  // --- OPENROUTER (Fallback met gratis modellen zoals Hermes en Qwen) ---
  if (process.env.OPENROUTER_API_KEY) {
    const orKey = process.env.OPENROUTER_API_KEY;
    providers.push({
      name: 'OpenRouter-Hermes',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: orKey,
      model: 'nousresearch/hermes-3-llama-3.1-8b:free',
      priority: 5,
    });
    providers.push({
      name: 'OpenRouter-Qwen',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: orKey,
      model: 'qwen/qwen-2-7b-instruct:free',
      priority: 6,
    });
    providers.push({
      name: 'OpenRouter-Llama',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: orKey,
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      priority: 7,
    });
  }

  // Sorteer op prioriteit (laagste getal = hoogste prioriteit)
  return providers.sort((a, b) => a.priority - b.priority);
}

import { GoogleGenAI } from '@google/genai';

/**
 * Stuur een bericht naar de AI. Het systeem probeert automatisch alle
 * geconfigureerde providers, in volgorde van prioriteit.
 */
export async function routeAIRequest(
  messages: AIMessage[],
  systemPrompt?: string
): Promise<AIResponse> {
  const providers = getProviders();

  if (providers.length === 0) {
    throw new Error(
      'Geen AI providers geconfigureerd. Voeg API keys toe aan je .env bestand.'
    );
  }

  const allMessages: AIMessage[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`[AI ROUTER] Proberen via ${provider.name}...`);
      
      let content = '';

      if (provider.baseUrl === 'google-genai-sdk') {
        // Gebruik de robuuste Google SDK voor Gemini
        const ai = new GoogleGenAI({ apiKey: provider.apiKey });
        // Zet messages om in 1 lange string (Gemini SDK houdt van platte tekst als simpele fallback)
        const promptString = allMessages.map(m => `[${m.role.toUpperCase()}]:\n${m.content}`).join('\n\n');
        
        const response = await ai.models.generateContent({
          model: provider.model,
          contents: promptString,
        });
        
        if (!response.text) {
          throw new Error('Gemini SDK gaf geen text terug');
        }
        content = response.text.trim();
      } else {
        // OpenAI Compatible endpoints (Cerebras, Groq, OpenRouter)
        const response = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${provider.apiKey}`,
            ...(provider.name.startsWith('OpenRouter') && {
              'HTTP-Referer': 'https://rebuildyourlife.eu',
              'X-Title': 'Sovereign Grid',
            }),
          },
          body: JSON.stringify({
            model: provider.model,
            messages: allMessages,
            max_tokens: 3000,
            temperature: 0.7,
          }),
        });

        if (response.status === 429 || response.status >= 500) {
          console.warn(`[AI ROUTER] ${provider.name} geeft ${response.status}. Schakel naar volgende...`);
          lastError = new Error(`${provider.name} rate limit of server error: ${response.status}`);
          continue;
        }

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[AI ROUTER] ${provider.name} fout: ${errText}`);
          lastError = new Error(errText);
          continue;
        }

        const data = await response.json();
        content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          lastError = new Error(`${provider.name} gaf geen content terug`);
          continue;
        }
      }

      console.log(`[AI ROUTER] ✅ Succes via ${provider.name}`);

      return {
        content,
        provider: provider.name,
        model: provider.model,
      };
    } catch (err: any) {
      console.warn(`[AI ROUTER] ${provider.name} netwerk fout:`, err.message);
      lastError = err;
      continue;
    }
  }

  // Alle providers gefaald
  throw new Error(
    `Alle AI providers gefaald. Laatste fout: ${lastError?.message}`
  );
}
