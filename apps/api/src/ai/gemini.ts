/**
 * ai/gemini.ts
 * ─────────────────────────────────────────────────────────────
 * Google Gemini 2.5 Provider — Orion's primaire AI engine
 * Directe verbinding via @google/generative-ai
 * Geen tussenlaag. Server-side only.
 * ─────────────────────────────────────────────────────────────
 */

import https from 'https';
import type { AIMessage, AICompletionResult, AIProviderConfig } from './provider.js';

// ─── Configuratie ─────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ?? process.env.GEMINI_API_KEY
  ?? '';

// Gemini 2.5 Flash — snel, gratis tier beschikbaar
const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-preview-05-20';

// ─── Gemini Status Check ──────────────────────────────────────

export async function getGeminiStatus(): Promise<{
  online: boolean;
  model: string;
  hasKey: boolean;
}> {
  const hasKey = !!GEMINI_API_KEY && GEMINI_API_KEY !== 'REPLACE_WITH_GEMINI_KEY';
  if (!hasKey) {
    return { online: false, model: DEFAULT_MODEL, hasKey: false };
  }

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${DEFAULT_MODEL}?key=${GEMINI_API_KEY}`,
        method: 'GET',
        timeout: 5000,
      },
      (res) => {
        resolve({
          online: res.statusCode === 200,
          model: DEFAULT_MODEL,
          hasKey: true,
        });
      }
    );
    req.on('error', () => resolve({ online: false, model: DEFAULT_MODEL, hasKey: true }));
    req.on('timeout', () => { req.destroy(); resolve({ online: false, model: DEFAULT_MODEL, hasKey: true }); });
    req.end();
  });
}

// ─── Gemini Completion ────────────────────────────────────────

/**
 * Voert een chat completion uit via Gemini 2.5.
 * Gebruikt de generateContent REST API direct.
 */
export async function geminiComplete(
  messages: AIMessage[],
  config: AIProviderConfig = {},
): Promise<AICompletionResult> {
  const start = Date.now();
  const model = config.model ?? DEFAULT_MODEL;
  const apiKey = GEMINI_API_KEY;

  if (!apiKey || apiKey === 'REPLACE_WITH_GEMINI_KEY') {
    return {
      ok: false,
      content: '',
      model,
      error: 'GOOGLE_GENERATIVE_AI_API_KEY niet geconfigureerd',
      durationMs: 0,
    };
  }

  // Bouw Gemini berichten formaat op
  const allMessages = config.systemPrompt
    ? [{ role: 'system' as const, content: config.systemPrompt }, ...messages]
    : messages;

  // Converteer naar Gemini contents formaat
  const contents = allMessages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // System instruction apart
  const systemInstruction = allMessages.find(m => m.role === 'system');

  const requestBody = JSON.stringify({
    contents,
    ...(systemInstruction && {
      systemInstruction: {
        parts: [{ text: systemInstruction.content }],
      },
    }),
    generationConfig: {
      temperature: config.temperature ?? 0.7,
      maxOutputTokens: config.maxTokens ?? 2048,
    },
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
        timeout: 60_000,
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
              console.error(`[GEMINI] ✗ API fout: ${errMsg}`);
              resolve({ ok: false, content: '', model, error: errMsg, durationMs });
              return;
            }

            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            const tokensUsed = parsed.usageMetadata?.totalTokenCount;
            console.log(`[GEMINI] ✓ Completion klaar — model: ${model} — ${tokensUsed ?? '?'} tokens — ${durationMs}ms`);
            resolve({ ok: true, content, model, tokensUsed, durationMs });
          } catch {
            resolve({ ok: false, content: '', model, error: 'Parse fout', durationMs });
          }
        });
      }
    );

    req.on('error', (err) => {
      resolve({ ok: false, content: '', model, error: err.message, durationMs: Date.now() - start });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, content: '', model, error: 'Gemini timeout', durationMs: Date.now() - start });
    });

    req.write(requestBody);
    req.end();
  });
}

export { DEFAULT_MODEL as GEMINI_MODEL, GEMINI_API_KEY };
