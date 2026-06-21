/**
 * ai/database.ts
 * ─────────────────────────────────────────────────────────────
 * AI Database Interface — AI ↔ PostgreSQL directe verbinding
 * De AI kan via deze module:
 *   - Direct queries uitvoeren
 *   - Context opslaan
 *   - Geheugen lezen
 *   - Structureerde data ophalen
 *
 * Geen externe tussenlaag. Server-side only.
 * ─────────────────────────────────────────────────────────────
 */

import { query, queryOne } from '../database/query.js';
import { saveMemory, loadMemory, buildContext, saveMessage } from './memory.js';
import { complete } from './provider.js';
import type { AIMessage, AIProviderConfig } from './provider.js';
import type { MemoryType } from './memory.js';

// ─── Types ────────────────────────────────────────────────────

export interface AIDatabaseQueryResult {
  ok: boolean;
  data?: Record<string, unknown>[];
  error?: string;
  rowCount?: number;
}

export interface AIExecuteOptions {
  userId: string;
  agentType: string;
  conversationId?: string;
  systemPrompt?: string;
  config?: AIProviderConfig;
}

export interface AIExecuteResult {
  ok: boolean;
  content: string;
  tokensUsed?: number;
  durationMs: number;
  error?: string;
  conversationId?: string;
}

// ─── AI Query Interface ────────────────────────────────────────

/**
 * De AI voert een directe, veilige SQL query uit.
 * Uitsluitend SELECT queries toegestaan via deze interface.
 * INSERT/UPDATE via saveAIContext.
 *
 * @param sql    - Parameterized SELECT query
 * @param params - Query parameters
 */
export async function aiQuery(
  sql: string,
  params: unknown[] = [],
): Promise<AIDatabaseQueryResult> {
  // Veiligheidscheck: alleen SELECT toegestaan
  const normalized = sql.trim().toUpperCase();
  if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
    return {
      ok: false,
      error: 'aiQuery staat alleen SELECT en WITH queries toe. Gebruik saveAIContext voor schrijven.',
    };
  }

  const result = await query(sql, params, { label: 'ai:query' });

  if (!result.ok) return { ok: false, error: result.error };

  return {
    ok: true,
    data: result.rows as Record<string, unknown>[],
    rowCount: result.rowCount,
  };
}

/**
 * Slaat AI-gegenereerde context op in de database.
 * Schrijft naar AIMemory tabel.
 */
export async function saveAIContext(
  userId: string,
  agentType: string,
  content: string,
  memoryType: MemoryType = 'SHORT_TERM',
  importance: number = 0.7,
): Promise<{ ok: boolean; id?: string }> {
  return saveMemory(userId, agentType, content, memoryType, importance);
}

/**
 * Laadt AI context (geheugen) voor een gebruiker.
 */
export async function loadAIContext(
  userId: string,
  agentType: string,
  limit: number = 20,
) {
  return loadMemory(userId, agentType, limit);
}

// ─── AI Executie met Database Context ─────────────────────────

/**
 * Voert een AI completion uit met volledige database context.
 * Laadt geheugen → bouwt context → voert completion uit → slaat op.
 *
 * @param userMessage - Bericht van de gebruiker
 * @param opts        - Gebruiker, agent, gesprek configuratie
 */
export async function executeWithContext(
  userMessage: string,
  opts: AIExecuteOptions,
): Promise<AIExecuteResult> {
  const start = Date.now();

  try {
    // 1. Bouw context op vanuit database
    const contextMessages = await buildContext(
      opts.userId,
      opts.agentType,
      opts.conversationId,
    );

    // 2. Voeg gebruikersbericht toe
    const messages: AIMessage[] = [
      ...contextMessages,
      { role: 'user', content: userMessage },
    ];

    // 3. AI completion uitvoeren
    const result = await complete(messages, {
      systemPrompt: opts.systemPrompt,
      ...opts.config,
    });

    if (!result.ok) {
      return {
        ok: false,
        content: '',
        error: result.error,
        durationMs: Date.now() - start,
        conversationId: opts.conversationId,
      };
    }

    // 4. Sla gebruikersbericht op in gesprek (als conversationId beschikbaar)
    if (opts.conversationId) {
      await saveMessage(opts.conversationId, 'user', userMessage);
      await saveMessage(
        opts.conversationId,
        'assistant',
        result.content,
        result.tokensUsed,
      );
    }

    // 5. Sla kort-termijn geheugen op
    await saveAIContext(
      opts.userId,
      opts.agentType,
      userMessage,
      'SHORT_TERM',
      0.6,
    );

    return {
      ok: true,
      content: result.content,
      tokensUsed: result.tokensUsed,
      durationMs: Date.now() - start,
      conversationId: opts.conversationId,
    };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[AI:DB] Execute fout:', error);
    return {
      ok: false,
      content: '',
      error,
      durationMs: Date.now() - start,
    };
  }
}

// ─── Gebruikerdata Ophalen voor AI ────────────────────────────

/**
 * Laadt gebruikersdata direct voor AI analyse.
 * Veilig — geen wachtwoorden of tokens.
 */
export async function loadUserDataForAI(userId: string): Promise<{
  user: Record<string, unknown> | null;
  goals: Record<string, unknown>[];
  recentTasks: Record<string, unknown>[];
}> {
  const [userResult, goalsResult, tasksResult] = await Promise.all([
    queryOne<Record<string, unknown>>(
      `SELECT id, email, "firstName", "lastName", "createdAt", "subscriptionTier"
       FROM "User" WHERE id = $1`,
      [userId],
      { label: 'ai:load-user' },
    ),
    query<Record<string, unknown>>(
      `SELECT id, title, description, status, progress, "targetDate"
       FROM "Goal" WHERE "userId" = $1 AND status != 'COMPLETED'
       ORDER BY "createdAt" DESC LIMIT 10`,
      [userId],
      { label: 'ai:load-goals' },
    ),
    query<Record<string, unknown>>(
      `SELECT id, title, status, priority, "dueDate"
       FROM "Task" WHERE "userId" = $1
       ORDER BY "createdAt" DESC LIMIT 20`,
      [userId],
      { label: 'ai:load-tasks' },
    ),
  ]);

  return {
    user: userResult,
    goals: goalsResult.ok ? goalsResult.rows : [],
    recentTasks: tasksResult.ok ? tasksResult.rows : [],
  };
}
