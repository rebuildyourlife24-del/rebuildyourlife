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
function getProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  // --- CEREBRAS (1M tokens/dag gratis) ---
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
      model: 'llama-3.3-70b',
      priority: 1,
    });
  });

  // --- GROQ (~1000 req/dag gratis) ---
  const groqKeys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
  ].filter(Boolean) as string[];

  groqKeys.forEach((key, i) => {
    providers.push({
      name: `Groq-${i + 1}`,
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: key,
      model: 'llama-3.3-70b-versatile',
      priority: 2,
    });
  });

  // --- GOOGLE GEMINI (1500 req/dag gratis) ---
  const geminiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[];

  geminiKeys.forEach((key, i) => {
    providers.push({
      name: `Gemini-${i + 1}`,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      apiKey: key,
      model: 'gemini-2.5-flash',
      priority: 3,
    });
  });

  // --- OPENROUTER (fallback: meerdere gratis modellen) ---
  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      name: 'OpenRouter-Fallback',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      priority: 4,
    });
  }

  // Sorteer op prioriteit
  return providers.sort((a, b) => a.priority - b.priority);
}

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

      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${provider.apiKey}`,
          // OpenRouter vereist een extra header
          ...(provider.name.startsWith('OpenRouter') && {
            'HTTP-Referer': 'https://rebuildyourlife.eu',
            'X-Title': 'Sovereign Grid',
          }),
        },
        body: JSON.stringify({
          model: provider.model,
          messages: allMessages,
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });

      // Als limiet bereikt (429) of server error, probeer volgende provider
      if (response.status === 429 || response.status >= 500) {
        console.warn(
          `[AI ROUTER] ${provider.name} geeft ${response.status}. Schakel naar volgende...`
        );
        lastError = new Error(`${provider.name} rate limit: ${response.status}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AI ROUTER] ${provider.name} fout: ${errText}`);
        lastError = new Error(errText);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        lastError = new Error(`${provider.name} gaf geen content terug`);
        continue;
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
