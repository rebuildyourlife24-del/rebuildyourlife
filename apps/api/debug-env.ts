/**
 * search-groq.ts
 * Zoek Groq key in alle database tabellen
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../packages/database/.env'), override: false });
dotenv.config({ path: path.resolve(__dirname, '.env'), override: false });

import { query } from './src/database/query.js';

async function main() {
  console.log('\n=== GROQ KEY ZOEKEN IN DATABASE ===\n');

  // 1. User tabel — alle key velden
  const userKeys = await query<any>(
    `SELECT id, email, "openaiKey", "firstName"
     FROM "User" WHERE id = '632c3b1a-d40e-4745-bff9-503c2bac09a5'`,
    [], { label: 'groq:user-key' }
  );
  if (userKeys.ok && userKeys.rows[0]) {
    const u = userKeys.rows[0];
    console.log(`User openaiKey: ${u.openaiKey ?? '✗ leeg'}`);
  }

  // 2. AnalyticsCache — config opslag
  const cache = await query<any>(
    `SELECT * FROM "AnalyticsCache" LIMIT 5`,
    [], { label: 'groq:analytics-cache' }
  );
  if (cache.ok && cache.rows.length > 0) {
    console.log('\nAnalyticsCache:');
    cache.rows.forEach((r: any) => console.log(JSON.stringify(r).slice(0, 120)));
  }

  // 3. OrionMemory — heeft Orion de key ooit opgeslagen als content?
  const orionMem = await query<any>(
    `SELECT content, trigger, "memoryType" FROM "OrionMemory"
     WHERE content ILIKE '%groq%' OR content ILIKE '%gsk_%' OR trigger ILIKE '%groq%'
     LIMIT 10`,
    [], { label: 'groq:orion-memory' }
  );
  if (orionMem.ok && orionMem.rows.length > 0) {
    console.log('\nOrionMemory met Groq:');
    orionMem.rows.forEach((r: any) => console.log(`  ${r.memoryType}: ${r.content?.slice(0, 80)}`));
  } else {
    console.log('\nGeen Groq in OrionMemory gevonden.');
  }

  // 4. AuditLog — was er ooit een Groq key update?
  const audit = await query<any>(
    `SELECT action, "entityType", "entityId", "createdAt"
     FROM "AuditLog"
     WHERE "entityType" ILIKE '%groq%' OR "entityType" ILIKE '%api%' OR "entityType" ILIKE '%key%'
     ORDER BY "createdAt" DESC LIMIT 10`,
    [], { label: 'groq:audit-log' }
  );
  if (audit.ok && audit.rows.length > 0) {
    console.log('\nAuditLog API gerelateerd:');
    audit.rows.forEach((r: any) => console.log(`  [${r.createdAt}] ${r.action} — ${r.entityType}`));
  }

  // 5. ApiKey tabel kolommen bekijken
  const apiKeySchema = await query<any>(
    `SELECT column_name, data_type FROM information_schema.columns
     WHERE table_name = 'ApiKey' ORDER BY ordinal_position`,
    [], { label: 'groq:apikey-schema' }
  );
  if (apiKeySchema.ok) {
    console.log('\nApiKey tabel kolommen:');
    apiKeySchema.rows.forEach((r: any) => console.log(`  ${r.column_name} (${r.data_type})`));

    // Haal dan de data op
    const apiKeys = await query<any>(
      `SELECT * FROM "ApiKey" LIMIT 10`,
      [], { label: 'groq:apikey-data' }
    );
    if (apiKeys.ok && apiKeys.rows.length > 0) {
      console.log('\nApiKey data:');
      apiKeys.rows.forEach((r: any) => console.log(JSON.stringify(r).slice(0, 150)));
    } else {
      console.log('ApiKey tabel is leeg.');
    }
  }

  process.exit(0);
}

main().catch(console.error);
