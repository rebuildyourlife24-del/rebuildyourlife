/**
 * ai/memory.ts
 * ─────────────────────────────────────────────────────────────
 * AI Memory — context opslaan en lezen via PostgreSQL
 * Directe database queries — geen Prisma tussenlaag nodig.
 * Maakt gebruik van de bestaande AIMemory / AIMessage tabellen.
 * ─────────────────────────────────────────────────────────────
 */

import { query } from '../database/query.js';

// ─── Types ────────────────────────────────────────────────────

export type MemoryType = 'SHORT_TERM' | 'LONG_TERM' | 'EPISODIC';

export interface MemoryEntry {
  id: string;
  userId: string;
  agentType: string;
  memoryType: MemoryType;
  content: string;
  importance: number;
  createdAt: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

// ─── Memory Opslaan ───────────────────────────────────────────

/**
 * Slaat een geheugen-item op in de database.
 * Directe SQL — geen Prisma.
 */
export async function saveMemory(
  userId: string,
  agentType: string,
  content: string,
  memoryType: MemoryType = 'SHORT_TERM',
  importance: number = 0.5,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const result = await query<{ id: string }>(
    `INSERT INTO "AIMemory" ("userId", "agentType", "memoryType", content, importance, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING id`,
    [userId, agentType, memoryType, content, importance],
    { label: 'memory:save' },
  );

  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, id: result.rows[0]?.id };
}

// ─── Memory Lezen ─────────────────────────────────────────────

/**
 * Laadt recente geheugens voor een gebruiker + agent.
 * Gesorteerd op belang en datum.
 */
export async function loadMemory(
  userId: string,
  agentType: string,
  limit: number = 20,
  memoryType?: MemoryType,
): Promise<MemoryEntry[]> {
  const typeFilter = memoryType ? 'AND "memoryType" = $4' : '';
  const params: unknown[] = memoryType
    ? [userId, agentType, limit, memoryType]
    : [userId, agentType, limit];

  const result = await query<MemoryEntry>(
    `SELECT id, "userId", "agentType", "memoryType", content, importance,
            "createdAt"
     FROM "AIMemory"
     WHERE "userId" = $1
       AND "agentType" = $2
       ${typeFilter}
     ORDER BY importance DESC, "createdAt" DESC
     LIMIT $3`,
    params,
    { label: 'memory:load' },
  );

  if (!result.ok) {
    console.error('[MEMORY] Laden mislukt:', result.error);
    return [];
  }

  return result.rows;
}

// ─── Gesprekgeschiedenis ──────────────────────────────────────

/**
 * Laadt berichtgeschiedenis van een gesprek.
 * Directe SQL query op AIMessage tabel.
 */
export async function loadConversationHistory(
  conversationId: string,
  limit: number = 50,
): Promise<ConversationMessage[]> {
  const result = await query<ConversationMessage>(
    `SELECT role, content, "createdAt"
     FROM "AIMessage"
     WHERE "conversationId" = $1
     ORDER BY "createdAt" ASC
     LIMIT $2`,
    [conversationId, limit],
    { label: 'memory:conversation-history' },
  );

  if (!result.ok) {
    console.error('[MEMORY] Gesprekgeschiedenis laden mislukt:', result.error);
    return [];
  }

  return result.rows;
}

/**
 * Slaat een AI bericht op in een gesprek.
 */
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  tokenCount?: number,
): Promise<{ ok: boolean; id?: string }> {
  const result = await query<{ id: string }>(
    `INSERT INTO "AIMessage" ("conversationId", role, content, "tokenCount", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING id`,
    [conversationId, role, content, tokenCount ?? null],
    { label: 'memory:save-message' },
  );

  if (!result.ok) return { ok: false };
  return { ok: true, id: result.rows[0]?.id };
}

// ─── Context Bouwen ───────────────────────────────────────────

/**
 * Bouwt een volledige AI context op basis van geheugen + gesprekgeschiedenis.
 * Klaar voor gebruik als messages array in AI completion.
 */
export async function buildContext(
  userId: string,
  agentType: string,
  conversationId?: string,
): Promise<{ role: 'user' | 'assistant' | 'system'; content: string }[]> {
  const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [];

  // Laad relevant geheugen
  const memories = await loadMemory(userId, agentType, 10, 'LONG_TERM');
  if (memories.length > 0) {
    const memoryContext = memories
      .map((m) => `- ${m.content}`)
      .join('\n');
    messages.push({
      role: 'system',
      content: `Gebruikersgeheugen (langetermijn):\n${memoryContext}`,
    });
  }

  // Laad gesprekgeschiedenis als conversationId opgegeven
  if (conversationId) {
    const history = await loadConversationHistory(conversationId, 30);
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  return messages;
}
