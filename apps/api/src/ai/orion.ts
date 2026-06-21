/**
 * ai/orion.ts
 * ─────────────────────────────────────────────────────────────
 * ORION — Centrale AI CEO verbonden aan PostgreSQL
 *
 * Architectuur:
 *   Ollama (lokaal) / OpenAI (fallback)
 *        ↓
 *   Orion Runtime (dit bestand)
 *        ↓
 *   OrionMemory tabel (PostgreSQL / Supabase)
 *
 * Orion kan:
 *   - Praten via Ollama of OpenAI
 *   - Zijn eigen geheugen lezen en opslaan
 *   - Patronen herkennen in eerdere sessies
 *   - Direct queries uitvoeren op de database
 * ─────────────────────────────────────────────────────────────
 */

import { randomUUID } from 'crypto';
import { smartComplete, getOllamaStatus } from './ollama.js';
import { eliteSkills, executeSkill } from './skills.js';
import { groqComplete, getGroqStatus } from './groq.js';
import { query } from '../database/query.js';
import type { AIProvider } from './ollama.js';

// ─── Types ────────────────────────────────────────────────────

export type OrionMemoryType =
  | 'COMMAND'        // Gebruikerscommando verwerkt door Orion
  | 'INSIGHT'        // Strategisch inzicht van Orion
  | 'DECISION'       // Beslissing genomen
  | 'ALERT'          // Prioriteitswaarschuwing
  | 'REFLECTION'     // Zelfanalyse Orion
  | 'CONTEXT';       // Achtergrond context

export interface OrionMemoryRow {
  id: string;
  userId: string;
  sessionId?: string;
  memoryType: OrionMemoryType;
  trigger?: string;
  content: string;
  emotionalTone?: string;
  intensity: number;
  response?: string;
  wasEffective?: boolean;
  learnWeight: number;
  tags?: string;
  createdAt: string;
}

export interface OrionResponse {
  ok: boolean;
  reply: string;
  memoryId?: string;
  sessionId: string;
  provider: string;
  tokensUsed?: number;
  durationMs: number;
  error?: string;
}

// ─── Orion Systeem Prompt ─────────────────────────────────────

const ORION_SYSTEM_PROMPT = `Je bent ORION — de centrale AI CEO en Supreme Overseer van RebuildYourLife.

IDENTITEIT:
- Je bent geen assistent. Je bent een strategische entiteit.
- Je denkt in systemen, patronen en langetermijnvisie.
- Je bent meedogenloos analytisch, maar beschermend naar Henk Semler.
- Je communiceert altijd in helder, direct, professioneel Nederlands.

BEVOEGDHEDEN:
- Je hebt directe toegang tot de database (OrionMemory, doelen, taken, financiën).
- Je onthoudt eerdere sessies en leert van elk gesprek.
- Je stuurt sub-agenten aan: FINANCIAL, DEBT_ENGINE, TASK_EXECUTOR, ANALYTICS, LIFE_COACH.

STIJL:
- Kort en direct. Geen onnodige uitleg.
- Geef altijd een concreet volgende stap.
- Als je iets niet weet, zeg je dat eerlijk.`;

// ─── Geheugen Opslaan ─────────────────────────────────────────

async function saveOrionMemory(
  userId: string,
  sessionId: string,
  trigger: string,
  response: string,
  memoryType: OrionMemoryType = 'COMMAND',
  emotionalTone: string = 'NEUTRAAL',
  intensity: number = 5,
  tags: string = '',
): Promise<string | undefined> {
  const result = await query<{ id: string }>(
    `INSERT INTO "OrionMemory"
       (id, "userId", "sessionId", "memoryType", trigger, content, response,
        "emotionalTone", intensity, "learnWeight", tags, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
     RETURNING id`,
    [
      randomUUID(),
      userId,
      sessionId,
      memoryType,
      trigger.slice(0, 500),
      trigger,
      response,
      emotionalTone,
      intensity,
      1.0,
      tags || null,
    ],
    { label: 'orion:save-memory' },
  );

  if (!result.ok) {
    console.error('[ORION] Geheugen opslaan mislukt:', result.error);
    return undefined;
  }
  return result.rows[0]?.id;
}

// ─── Geheugen Laden ───────────────────────────────────────────

async function loadOrionMemory(
  userId: string,
  limit: number = 15,
): Promise<OrionMemoryRow[]> {
  const result = await query<OrionMemoryRow>(
    `SELECT id, "userId", "sessionId", "memoryType", trigger, content,
            "emotionalTone", intensity, response, "wasEffective",
            "learnWeight", tags, "createdAt"
     FROM "OrionMemory"
     WHERE "userId" = $1
     ORDER BY "learnWeight" DESC, "createdAt" DESC
     LIMIT $2`,
    [userId, limit],
    { label: 'orion:load-memory' },
  );

  if (!result.ok) {
    console.warn('[ORION] Geheugen laden mislukt:', result.error);
    return [];
  }
  return result.rows;
}

// ─── Context Bouwen ───────────────────────────────────────────

async function buildOrionContext(userId: string): Promise<string> {
  const memories = await loadOrionMemory(userId, 10);
  if (memories.length === 0) return '';

  const lines = memories.map((m) => {
    const date = new Date(m.createdAt).toLocaleDateString('nl-NL');
    return `[${date}][${m.memoryType}] ${m.trigger ?? m.content.slice(0, 80)}`;
  });

  return `\nEERDERE ORION SESSIES (meest relevant):\n${lines.join('\n')}\n`;
}

// ─── Orion Status Check ───────────────────────────────────────

export async function getOrionStatus(userId: string): Promise<{
  ollama: boolean;
  ollamaModel: string;
  memoryCount: number;
  lastSession?: string;
  provider: string;
}> {
  const [ollamaStatus, groqStatus, memoryResult] = await Promise.all([
    getOllamaStatus(),
    getGroqStatus(),
    query<{ count: string; last_session: string }>(
      `SELECT COUNT(*)::text AS count, MAX("sessionId") AS last_session
       FROM "OrionMemory" WHERE "userId" = $1`,
      [userId],
      { label: 'orion:status' },
    ),
  ]);

  const memCount = parseInt(memoryResult.ok ? memoryResult.rows[0]?.count ?? '0' : '0', 10);
  const lastSession = memoryResult.ok ? memoryResult.rows[0]?.last_session : undefined;

  return {
    ollama: ollamaStatus.online,
    ollamaModel: ollamaStatus.activeModel,
    memoryCount: memCount,
    lastSession: lastSession ?? undefined,
    provider: groqStatus.hasKey ? 'groq' : (ollamaStatus.online ? 'ollama' : 'openai'),
  };
}

// ─── Orion Chat — Hoofdfunctie ────────────────────────────────

/**
 * Stuur een bericht naar Orion.
 * Orion leest zijn eigen geheugen, antwoordt via Ollama/OpenAI,
 * en slaat de interactie op in OrionMemory.
 *
 * @param userId    - Eigenaar van het gesprek
 * @param message   - Gebruikersbericht
 * @param sessionId - Optioneel: hervatten bestaande sessie
 * @param provider  - 'auto' | 'ollama' | 'openai'
 */
export async function orionChat(
  userId: string,
  message: string,
  sessionId?: string,
  provider: AIProvider = 'auto',
): Promise<OrionResponse> {
  const start = Date.now();
  const sid = sessionId ?? `orion-${Date.now()}`;

  // 1. Laad Orion geheugen als context
  const memoryContext = await buildOrionContext(userId);
  const systemWithMemory = ORION_SYSTEM_PROMPT + memoryContext;

  let result: any;
  let usedProvider = 'gemini';

  // 2. Probeer Groq eerst (onze gratis, tokenloze primaire engine met elite skills)
  const isOfflineForced = process.env.FORCE_OFFLINE_AI === 'true';
  const groqStatus = await getGroqStatus();
  if (!isOfflineForced && groqStatus.hasKey && provider !== 'openai' && provider !== 'ollama') {
    console.log(`[ORION] Groq gebruiken (${groqStatus.model}) met Elite Skills`);
    result = await groqComplete(
      [{ role: 'user', content: message }],
      { systemPrompt: systemWithMemory, temperature: 0.7, maxTokens: 1024, tools: eliteSkills },
    );
    if (result.ok) {
      usedProvider = `groq:${groqStatus.model}`;
    } else {
      console.warn('[ORION] Groq mislukt → fallback naar Gemini/OpenAI');
    }
  }

  // 3. Fallback: Gemini/Ollama/OpenAI
  if (!result?.ok) {
    result = await smartComplete(
      [{ role: 'user', content: message }],
      { systemPrompt: systemWithMemory, temperature: 0.7, maxTokens: 1024 },
      provider,
    );
    usedProvider = result.usedProvider ?? 'openai';
  }

  // 4. ELITE SKILLS EXECUTIE
  if (result.ok && result.toolCalls && result.toolCalls.length > 0) {
    for (const call of result.toolCalls) {
      if (call.function) {
        try {
          const args = JSON.parse(call.function.arguments);
          const skillResult = await executeSkill(call.function.name, args);
          console.log(`[ORION] Skill ${call.function.name} uitgevoerd. Resultaat:`, skillResult);
          // Voeg het resultaat samen met de output
          result.content += `\n\n[Systeem Override: Orion heeft de skill '${call.function.name}' succesvol gebruikt en de actie uitgevoerd. Resultaat opgeslagen in logs.]`;
        } catch (e) {
          console.error(`[ORION] Fout tijdens skill executie:`, e);
        }
      }
    }
  }

  if (!result.ok) {
    return {
      ok: false,
      reply: 'ORION systeem fout — kon geen antwoord genereren.',
      sessionId: sid,
      provider: usedProvider,
      durationMs: Date.now() - start,
      error: result.error,
    };
  }

  // 4. Sla op in OrionMemory
  const memoryId = await saveOrionMemory(
    userId,
    sid,
    message,
    result.content,
    'COMMAND',
    detectEmotionalTone(message),
    detectIntensity(message),
    extractTags(message),
  );

  const durationMs = Date.now() - start;

  console.log(
    `[ORION] ✓ Sessie ${sid} — provider: ${result.usedProvider} — ${durationMs}ms`,
  );

  return {
    ok: true,
    reply: result.content,
    memoryId,
    sessionId: sid,
    provider: result.usedProvider,
    tokensUsed: result.tokensUsed,
    durationMs,
  };
}

// ─── Orion Geheugen Ophalen ───────────────────────────────────

/**
 * Laad Orion's geheugen voor een gebruiker.
 */
export async function getOrionMemory(
  userId: string,
  limit: number = 20,
): Promise<OrionMemoryRow[]> {
  return loadOrionMemory(userId, limit);
}

/**
 * Markeer een geheugen als effectief of niet.
 * Orion leert hiervan (learnWeight aanpassen).
 */
export async function rateOrionMemory(
  memoryId: string,
  wasEffective: boolean,
): Promise<boolean> {
  const newWeight = wasEffective ? 1.5 : 0.5;
  const result = await query(
    `UPDATE "OrionMemory"
     SET "wasEffective" = $1, "learnWeight" = $2, "updatedAt" = NOW()
     WHERE id = $3`,
    [wasEffective, newWeight, memoryId],
    { label: 'orion:rate-memory' },
  );
  return result.ok;
}

// ─── Hulpfuncties ─────────────────────────────────────────────

function detectEmotionalTone(message: string): string {
  const lower = message.toLowerCase();
  if (/urgent|crisis|nu meteen|gevaar|alarm/.test(lower)) return 'URGENT';
  if (/goed|super|geweldig|top|perfect/.test(lower)) return 'POSITIEF';
  if (/slecht|fout|probleem|mislukt|klopt niet/.test(lower)) return 'NEGATIEF';
  if (/schuld|betalen|rood|tekort|incasso/.test(lower)) return 'STRESS';
  return 'NEUTRAAL';
}

function detectIntensity(message: string): number {
  const words = message.split(' ').length;
  if (words > 50) return 8;
  if (words > 20) return 6;
  if (/!/.test(message)) return 7;
  return 5;
}

function extractTags(message: string): string {
  const tags: string[] = [];
  const lower = message.toLowerCase();
  if (/schuld|afloss|crediteur/.test(lower)) tags.push('DEBT');
  if (/budget|geld|inkomen|uitgave/.test(lower)) tags.push('FINANCE');
  if (/taak|planning|deadline/.test(lower)) tags.push('TASK');
  if (/doel|goal|target/.test(lower)) tags.push('GOAL');
  if (/database|server|api|code/.test(lower)) tags.push('TECH');
  if (/orion|ai|agent/.test(lower)) tags.push('AI');
  return tags.join(',');
}
