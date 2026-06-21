/**
 * ai/ollama.ts
 * ─────────────────────────────────────────────────────────────
 * Ollama Provider — Lokale LLM verbinding
 * Directe HTTP verbinding naar Ollama API (geen externe library).
 * Automatische fallback naar OpenAI als Ollama offline is.
 *
 * Standaard Ollama endpoint: http://localhost:11434
 * ─────────────────────────────────────────────────────────────
 */

import http from 'http';
import { complete as openAIComplete } from './provider.js';
import type { AIMessage, AICompletionResult, AIProviderConfig } from './provider.js';

// ─── Configuratie ─────────────────────────────────────────────

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'localhost';
const OLLAMA_PORT = parseInt(process.env.OLLAMA_PORT ?? '11434', 10);
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3';
const OLLAMA_TIMEOUT_MS = 60_000;

// ─── Types ────────────────────────────────────────────────────

export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
}

export type AIProvider = 'ollama' | 'openai' | 'auto';

// ─── Status Check ─────────────────────────────────────────────

/**
 * Controleert of Ollama actief is en welke modellen beschikbaar zijn.
 */
export async function getOllamaStatus(): Promise<{
  online: boolean;
  models: OllamaModel[];
  activeModel: string;
}> {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: OLLAMA_HOST,
        port: OLLAMA_PORT,
        path: '/api/tags',
        method: 'GET',
        timeout: 3000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const models: OllamaModel[] = parsed.models ?? [];
            console.log(`[OLLAMA] ✓ Online — ${models.length} modellen geladen`);
            resolve({ online: true, models, activeModel: OLLAMA_MODEL });
          } catch {
            resolve({ online: false, models: [], activeModel: OLLAMA_MODEL });
          }
        });
      },
    );
    req.on('error', () => resolve({ online: false, models: [], activeModel: OLLAMA_MODEL }));
    req.on('timeout', () => { req.destroy(); resolve({ online: false, models: [], activeModel: OLLAMA_MODEL }); });
    req.end();
  });
}

// ─── Ollama Completion ────────────────────────────────────────

/**
 * Voert een chat completion uit via de lokale Ollama API.
 * Gebruikt /api/chat endpoint (OpenAI-compatible formaat).
 */
export async function ollamaComplete(
  messages: AIMessage[],
  config: AIProviderConfig = {},
): Promise<AICompletionResult> {
  const start = Date.now();
  const model = config.model ?? OLLAMA_MODEL;

  const allMessages: AIMessage[] = config.systemPrompt
    ? [{ role: 'system', content: config.systemPrompt }, ...messages]
    : messages;

  const body = JSON.stringify({
    model,
    messages: allMessages,
    stream: false,
    options: {
      temperature: config.temperature ?? 0.7,
      num_predict: config.maxTokens ?? 2048,
    },
  });

  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: OLLAMA_HOST,
        port: OLLAMA_PORT,
        path: '/api/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: OLLAMA_TIMEOUT_MS,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          const durationMs = Date.now() - start;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.message?.content ?? '';
            console.log(`[OLLAMA] ✓ Completion klaar — model: ${model} — ${durationMs}ms`);
            resolve({ ok: true, content, model, durationMs });
          } catch (err) {
            resolve({ ok: false, content: '', model, error: 'Ollama parse fout', durationMs });
          }
        });
      },
    );

    req.on('error', (err) => {
      const durationMs = Date.now() - start;
      console.warn(`[OLLAMA] ✗ Fout: ${err.message}`);
      resolve({ ok: false, content: '', model, error: err.message, durationMs });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, content: '', model, error: 'Ollama timeout', durationMs: Date.now() - start });
    });

    req.write(body);
    req.end();
  });
}

// ─── Slimme Provider Selector ─────────────────────────────────

/**
 * Voert een AI completion uit via de beste beschikbare provider.
 *
 * Volgorde:
 *   1. Ollama (lokaal, snel, gratis)
 *   2. OpenAI (als Ollama offline of mislukt)
 *
 * @param messages  - Berichtgeschiedenis
 * @param config    - Model, temperature, max_tokens
 * @param provider  - 'ollama' | 'openai' | 'auto' (standaard: auto)
 */
export async function smartComplete(
  messages: AIMessage[],
  config: AIProviderConfig = {},
  provider: AIProvider = 'auto',
): Promise<AICompletionResult & { usedProvider: string }> {

  // ── Forced OpenAI ─────────────────────────────────────────
  if (provider === 'openai') {
    const result = await openAIComplete(messages, config);
    return { ...result, usedProvider: 'openai' };
  }

  // ── Forced Ollama ─────────────────────────────────────────
  if (provider === 'ollama') {
    const result = await ollamaComplete(messages, config);
    return { ...result, usedProvider: 'ollama' };
  }

  // ── Auto: probeer Ollama, fallback naar OpenAI ────────────
  const status = await getOllamaStatus();

  if (status.online) {
    console.log(`[AI] Ollama online → gebruik lokale LLM (${OLLAMA_MODEL})`);
    const result = await ollamaComplete(messages, config);
    if (result.ok) return { ...result, usedProvider: 'ollama' };
    console.warn('[AI] Ollama completion mislukt → fallback naar OpenAI');
  } else {
    console.log('[AI] Ollama offline → gebruik OpenAI');
  }

  const result = await openAIComplete(messages, config);
  return { ...result, usedProvider: 'openai' };
}

export { OLLAMA_MODEL, OLLAMA_HOST, OLLAMA_PORT };
