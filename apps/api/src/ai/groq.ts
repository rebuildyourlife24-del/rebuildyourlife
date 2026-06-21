/**
 * ai/groq.ts
 * ─────────────────────────────────────────────────────────────
 * Groq Provider — Orion's primaire AI engine
 * Groq is razendsnel (70B tokens/sec), gratis tier, geen quota probleem.
 * Model: llama-3.3-70b-versatile (Groq's beste model)
 *
 * Directe HTTPS verbinding — geen externe libraries.
 * Server-side only. Key nooit client-side.
 * ─────────────────────────────────────────────────────────────
 */

import https from 'https';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AIMessage, AICompletionResult, AIProviderConfig } from './provider.js';

// Laad alle env bestanden zodat GROQ_API_KEY altijd beschikbaar is
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../packages/database/.env'), override: false });
dotenv.config({ override: false });

// ─── Configuratie ─────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? '';
const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';
const GROQ_HOST = 'api.groq.com';

// ─── Status Check ─────────────────────────────────────────────

export async function getGroqStatus(): Promise<{
  online: boolean;
  hasKey: boolean;
  model: string;
}> {
  const hasKey = !!GROQ_API_KEY && GROQ_API_KEY.startsWith('gsk_');
  if (!hasKey) return { online: false, hasKey: false, model: GROQ_MODEL };

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: GROQ_HOST,
        path: '/openai/v1/models',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` },
        timeout: 5000,
      },
      (res) => resolve({ online: res.statusCode === 200, hasKey: true, model: GROQ_MODEL })
    );
    req.on('error', () => resolve({ online: false, hasKey: true, model: GROQ_MODEL }));
    req.on('timeout', () => { req.destroy(); resolve({ online: false, hasKey: true, model: GROQ_MODEL }); });
    req.end();
  });
}

// ─── Groq Completion ──────────────────────────────────────────

/**
 * Voert een chat completion uit via Groq API.
 * Groq gebruikt OpenAI-compatibel formaat — snel en betrouwbaar.
 */
export async function groqComplete(
  messages: AIMessage[],
  config: AIProviderConfig = {},
): Promise<AICompletionResult> {
  const start = Date.now();
  const model = config.model ?? GROQ_MODEL;
  const apiKey = GROQ_API_KEY;

  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return { ok: false, content: '', model, error: 'GROQ_API_KEY niet geconfigureerd', durationMs: 0 };
  }

  const allMessages: AIMessage[] = config.systemPrompt
    ? [{ role: 'system', content: config.systemPrompt }, ...messages]
    : messages;

  const body: any = {
    model,
    messages: allMessages,
    temperature: config.temperature ?? 0.7,
    max_tokens: config.maxTokens ?? 2048,
  };

  if (config.tools && config.tools.length > 0) {
    body.tools = config.tools;
    body.tool_choice = 'auto';
  }

  const jsonBody = JSON.stringify(body);

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: GROQ_HOST,
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(jsonBody),
        },
        timeout: 30_000,
      },
      (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          const durationMs = Date.now() - start;
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode !== 200) {
              const errMsg = parsed.error?.message ?? `HTTP ${res.statusCode}`;
              console.error(`[GROQ] ✗ ${errMsg}`);
              resolve({ ok: false, content: '', model, error: errMsg, durationMs });
              return;
            }
            const messageData = parsed.choices?.[0]?.message;
            const content = messageData?.content ?? '';
            const toolCalls = messageData?.tool_calls;
            const tokensUsed = parsed.usage?.total_tokens;
            console.log(`[GROQ] ✓ ${model} — ${tokensUsed ?? '?'} tokens — ${durationMs}ms`);
            resolve({ ok: true, content, model, tokensUsed, durationMs, toolCalls });
          } catch {
            resolve({ ok: false, content: '', model, error: 'Parse fout', durationMs });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ ok: false, content: '', model, error: err.message, durationMs: Date.now() - start }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, content: '', model, error: 'Groq timeout', durationMs: Date.now() - start }); });
    req.write(jsonBody);
    req.end();
  });
}

export { GROQ_MODEL, GROQ_API_KEY };
