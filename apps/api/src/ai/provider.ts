/**
 * ai/provider.ts
 * ─────────────────────────────────────────────────────────────
 * AI Provider — centrale LLM gateway
 * Geen externe tussenlaag. Directe verbinding met OpenAI.
 * Service-side only — API key nooit client-side.
 * ─────────────────────────────────────────────────────────────
 */

import OpenAI from 'openai';

// ─── Types ────────────────────────────────────────────────────

export type AIRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AICompletionResult {
  ok: boolean;
  content: string;
  model: string;
  tokensUsed?: number;
  durationMs: number;
  toolCalls?: any[];
  error?: string;
}

export interface AIProviderConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  tools?: any[];
}

// ─── Provider Singleton ───────────────────────────────────────

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'sk-placeholder' || apiKey.startsWith('sk-proj-REPLACE')) {
      throw new Error('[AI] OPENAI_API_KEY niet geconfigureerd');
    }
    openaiClient = new OpenAI({ apiKey });
    console.log('[AI] OpenAI client aangemaakt');
  }
  return openaiClient;
}

// ─── Kernfunctie: Completion ──────────────────────────────────

/**
 * Voert een AI completion uit via OpenAI.
 * Directe verbinding — geen externe tussenlaag.
 *
 * @param messages   - Gespreksgeschiedenis inclusief system prompt
 * @param config     - Model, temperature, max_tokens
 */
export async function complete(
  messages: AIMessage[],
  config: AIProviderConfig = {},
): Promise<AICompletionResult> {
  const start = Date.now();
  const model = config.model ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
  const temperature = config.temperature ?? 0.7;
  const maxTokens = config.maxTokens ?? 2048;

  // Voeg system prompt toe als niet al aanwezig
  const allMessages: AIMessage[] = config.systemPrompt
    ? [{ role: 'system', content: config.systemPrompt }, ...messages]
    : messages;

  try {
    const client = getOpenAIClient();

    console.log(`[AI] Completion starten — model: ${model}, berichten: ${allMessages.length}`);

    const completion = await client.chat.completions.create({
      model,
      messages: allMessages as OpenAI.ChatCompletionMessageParam[],
      temperature,
      max_tokens: maxTokens,
    });

    const content = completion.choices[0]?.message?.content ?? '';
    const tokensUsed = completion.usage?.total_tokens;
    const durationMs = Date.now() - start;

    console.log(`[AI] ✓ Completion klaar — ${tokensUsed ?? '?'} tokens — ${durationMs}ms`);

    return { ok: true, content, model, tokensUsed, durationMs };
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[AI] ✗ Completion fout (${durationMs}ms):`, error);
    return { ok: false, content: '', model, error, durationMs };
  }
}

/**
 * Test of de AI provider bereikbaar is.
 */
export async function testAIProvider(): Promise<boolean> {
  try {
    const result = await complete(
      [{ role: 'user', content: 'Reply with: OK' }],
      { model: 'gpt-4o-mini', maxTokens: 5, temperature: 0 },
    );
    return result.ok;
  } catch {
    return false;
  }
}

export { getOpenAIClient };
