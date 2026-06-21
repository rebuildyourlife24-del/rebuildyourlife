/**
 * validate-infra.ts
 * ─────────────────────────────────────────────────────────────
 * Validatiescript voor de basisinfrastructuur
 * Controleert: postgres, service role, read, write, reconnect
 * ─────────────────────────────────────────────────────────────
 * Gebruik: npx tsx validate-infra.ts
 */

import dotenv from 'dotenv';
import path from 'path';

// Laad env in prioriteitsvolgorde (eerste gevonden waarde wint)
// Root .env heeft werkende pooler URL — heeft prioriteit
dotenv.config({ path: path.resolve('../../.env') });
// Database package .env als fallback
dotenv.config({ path: path.resolve('../../packages/database/.env'), override: false });
// Lokale api .env als laatste fallback
dotenv.config({ override: false });

import { checkDatabaseHealth, formatHealthReport } from './src/database/health.js';

async function main() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  REBUILDYOURLIFE — INFRASTRUCTUUR VALIDATIE');
  console.log('══════════════════════════════════════════════════\n');

  console.log('[INIT] DATABASE_URL aanwezig:', !!process.env.DATABASE_URL);
  console.log('[INIT] DIRECT_URL aanwezig:', !!process.env.DIRECT_URL);
  console.log('[INIT] OPENAI_API_KEY aanwezig:', !!process.env.OPENAI_API_KEY);
  console.log('');

  // Health check uitvoeren
  const status = await checkDatabaseHealth();
  const report = formatHealthReport(status);

  console.log('\n══════════════════════════════════════════════════');
  console.log('  RESULTAAT');
  console.log('══════════════════════════════════════════════════');

  for (const [key, value] of Object.entries(report)) {
    const icon = value === 'JA' ? '✓' : value === 'NEE' ? '✗' : '→';
    console.log(`  ${icon} ${key}: ${value}`);
  }

  console.log('══════════════════════════════════════════════════\n');

  process.exit(status.postgres && status.canRead ? 0 : 1);
}

main().catch((err) => {
  console.error('\n[FOUT] Validatie mislukt:', err.message);
  process.exit(1);
});
