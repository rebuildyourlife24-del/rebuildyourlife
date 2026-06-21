/**
 * database/query.ts
 * ─────────────────────────────────────────────────────────────
 * Database Gateway — Centrale query executor
 * Alle AI en server-side queries lopen via deze laag.
 * Inclusief logging, timing en foutafhandeling.
 * ─────────────────────────────────────────────────────────────
 */

import { getPool } from './connect.js';
import type { QueryResult, QueryResultRow } from 'pg';

// ─── Types ────────────────────────────────────────────────────

export interface QueryOptions {
  timeout?: number;   // ms, overschrijft standaard 30s
  label?: string;     // voor logging
}

export interface QuerySuccess<T> {
  ok: true;
  rows: T[];
  rowCount: number;
  durationMs: number;
}

export interface QueryFailure {
  ok: false;
  error: string;
  code?: string;
  durationMs: number;
}

export type QueryResponse<T> = QuerySuccess<T> | QueryFailure;

// ─── Core Query Function ──────────────────────────────────────

/**
 * Voert een parameterized SQL query uit.
 * Altijd safe — nooit string interpolation.
 *
 * @param sql    - Parameterized SQL string, bijv. "SELECT * FROM users WHERE id = $1"
 * @param params - Parameter array, bijv. [userId]
 * @param opts   - Optionele timeout en label
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
  opts: QueryOptions = {},
): Promise<QueryResponse<T>> {
  const label = opts.label ?? 'query';
  const start = Date.now();

  const pool = getPool();
  const client = await pool.connect();

  try {
    // Timeout instellen op sessieniveau als opgegeven
    if (opts.timeout) {
      await client.query(`SET statement_timeout = ${opts.timeout}`);
    }

    console.log(`[DB][${label}] SQL: ${sql.slice(0, 120)}...`);

    const result: QueryResult<T> = await client.query<T>(sql, params);
    const durationMs = Date.now() - start;

    console.log(`[DB][${label}] ✓ ${result.rowCount ?? 0} rijen — ${durationMs}ms`);

    return {
      ok: true,
      rows: result.rows,
      rowCount: result.rowCount ?? 0,
      durationMs,
    };
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    const error = err instanceof Error ? err.message : String(err);
    const code = (err as any)?.code;

    console.error(`[DB][${label}] ✗ Fout (${durationMs}ms): ${error}`);

    return {
      ok: false,
      error,
      code,
      durationMs,
    };
  } finally {
    client.release();
  }
}

// ─── Transactie Wrapper ───────────────────────────────────────

/**
 * Voert meerdere queries uit in één transactie.
 * Bij fout wordt automatisch teruggedraaid (ROLLBACK).
 */
export async function transaction<T>(
  fn: (queryFn: typeof query) => Promise<T>,
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Gebonden query-functie die de transactie-client hergebruikt
    const txQuery = async <R extends QueryResultRow>(
      sql: string,
      params: unknown[] = [],
      opts: QueryOptions = {},
    ): Promise<QueryResponse<R>> => {
      const label = opts.label ?? 'tx-query';
      const start = Date.now();
      try {
        const result = await client.query<R>(sql, params);
        const durationMs = Date.now() - start;
        console.log(`[DB][${label}] ✓ tx ${result.rowCount ?? 0} rijen — ${durationMs}ms`);
        return { ok: true, rows: result.rows, rowCount: result.rowCount ?? 0, durationMs };
      } catch (err: unknown) {
        const durationMs = Date.now() - start;
        const error = err instanceof Error ? err.message : String(err);
        return { ok: false, error, code: (err as any)?.code, durationMs };
      }
    };

    const result = await fn(txQuery as typeof query);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─── Hulpfuncties ─────────────────────────────────────────────

/**
 * Voert een enkele rij-query uit.
 * Gooit als er geen rij gevonden wordt.
 */
export async function queryOne<T extends QueryResultRow>(
  sql: string,
  params: unknown[] = [],
  opts: QueryOptions = {},
): Promise<T | null> {
  const result = await query<T>(sql, params, opts);
  if (!result.ok) throw new Error(`DB fout: ${result.error}`);
  return result.rows[0] ?? null;
}
