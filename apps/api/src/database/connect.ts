/**
 * database/connect.ts
 * ─────────────────────────────────────────────────────────────
 * Directe PostgreSQL verbinding — Database Gateway
 * Gebruikt pg (node-postgres) voor raw SQL toegang naast Prisma.
 * Service Role verbinding — uitsluitend server-side.
 * ─────────────────────────────────────────────────────────────
 */

import { Pool, PoolClient, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// ─── Configuratie ────────────────────────────────────────────

// Verwijder pgbouncer=true parameter voor directe pg client
// (pg client stuurt geen prepared statements, dus pgbouncer werkt)
function buildConnectionString(): string {
  // Voorkeur: pooler URL (poort 6543) — poort 5432 is vaak geblokkeerd op externe netwerken
  const url = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
  // Verwijder pgbouncer=true en vervang door lege string voor pg client compatibiliteit
  return url.replace('?pgbouncer=true', '').replace('&pgbouncer=true', '');
}

const POOL_CONFIG: PoolConfig = {
  connectionString: buildConnectionString(),
  max: 10,                    // maximaal 10 connecties
  min: 2,                     // minimaal 2 warm houden
  idleTimeoutMillis: 30_000,  // 30s inactief → sluiten
  connectionTimeoutMillis: 8_000,  // 8s timeout op connect
  ssl: { rejectUnauthorized: false }, // Supabase vereist SSL
};

// ─── Pool Singleton ──────────────────────────────────────────

let pool: Pool | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 2_000;

function createPool(): Pool {
  const newPool = new Pool(POOL_CONFIG);

  newPool.on('connect', () => {
    console.log('[DB] Nieuwe connectie aangemaakt');
  });

  newPool.on('error', (err: Error) => {
    console.error('[DB] Pool fout:', err.message);
    scheduleReconnect();
  });

  newPool.on('remove', () => {
    console.log('[DB] Connectie verwijderd uit pool');
  });

  return newPool;
}

function scheduleReconnect(): void {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('[DB] Maximum reconnect pogingen bereikt. Geef op.');
    return;
  }

  reconnectAttempts++;
  const delay = RECONNECT_DELAY_MS * reconnectAttempts;
  console.warn(`[DB] Reconnect poging ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} over ${delay}ms...`);

  setTimeout(() => {
    console.log('[DB] Nieuwe pool aanmaken na fout...');
    pool = createPool();
    reconnectAttempts = 0;
  }, delay);
}

// ─── Publieke Interface ──────────────────────────────────────

/**
 * Geeft de actieve pool terug.
 * Maakt een nieuwe aan als die nog niet bestaat.
 */
export function getPool(): Pool {
  if (!pool) {
    console.log('[DB] Database pool initialiseren...');
    pool = createPool();
  }
  return pool;
}

/**
 * Test of de database bereikbaar is.
 * Gooit een Error als de verbinding mislukt.
 */
export async function connectToDatabase(): Promise<void> {
  const p = getPool();
  const client = await p.connect();
  try {
    await client.query('SELECT 1');
    console.log('[DB] ✓ PostgreSQL verbinding OK');
  } finally {
    client.release();
  }
}

/**
 * Sluit de pool netjes af.
 * Gebruik bij graceful shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[DB] Pool afgesloten');
  }
}

export type { Pool, PoolClient };
