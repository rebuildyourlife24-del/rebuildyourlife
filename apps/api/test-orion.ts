/**
 * test-orion.ts
 * ─────────────────────────────────────────────────────────────
 * Direct Orion testen via Ollama → PostgreSQL
 * Gebruik: npx tsx test-orion.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../packages/database/.env'), override: false });
dotenv.config({ path: path.resolve(__dirname, '.env'), override: false });

// Zet Groq key expliciet als die gevonden is
const GROQ_KEY = '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';
if (!process.env.GROQ_API_KEY) process.env.GROQ_API_KEY = GROQ_KEY;

import { orionChat, getOrionStatus, getOrionMemory } from './src/ai/orion.js';

// Test gebruiker — gebruik een bestaande userId als je die hebt
// of laat leeg om status-only te testen
const TEST_USER_ID = process.env.TEST_USER_ID ?? '00000000-0000-0000-0000-000000000001';

async function main() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  ORION — VERBINDINGSTEST');
  console.log('══════════════════════════════════════════════════\n');

  // ── 1. Orion Status ────────────────────────────────────────
  console.log('→ Status ophalen...');
  const status = await getOrionStatus(TEST_USER_ID);

  console.log(`  Ollama online:    ${status.ollama ? '✓ JA' : '✗ NEE (OpenAI fallback)'}`);
  console.log(`  Actief model:     ${status.ollamaModel}`);
  console.log(`  Provider:         ${status.provider}`);
  console.log(`  Orion herinneringen: ${status.memoryCount}`);
  if (status.lastSession) {
    console.log(`  Laatste sessie:   ${status.lastSession}`);
  }

  // ── 2. Orion Chat Test ─────────────────────────────────────
  console.log('\n→ Orion aanroepen...');
  console.log('  Bericht: "Orion, wat is de status van de infrastructuur?"');

  const response = await orionChat(
    TEST_USER_ID,
    'Orion, wat is de status van de infrastructuur? Geef een korte situatierapportage.',
    undefined,
    'auto',
  );

  console.log('\n══════════════════════════════════════════════════');
  console.log('  ORION ANTWOORD');
  console.log('══════════════════════════════════════════════════');

  if (response.ok) {
    console.log(`\n  Provider:    ${response.provider}`);
    console.log(`  Sessie ID:   ${response.sessionId}`);
    console.log(`  Memory ID:   ${response.memoryId ?? 'niet opgeslagen'}`);
    console.log(`  Tijd:        ${response.durationMs}ms`);
    console.log('\n  ORION ZEGT:\n');
    console.log(response.reply.split('\n').map(l => `  ${l}`).join('\n'));

    // ── 3. Geheugen controleren ──────────────────────────
    console.log('\n══════════════════════════════════════════════════');
    console.log('  ORION GEHEUGEN (DATABASE)');
    console.log('══════════════════════════════════════════════════');

    const memories = await getOrionMemory(TEST_USER_ID, 5);
    if (memories.length > 0) {
      console.log(`\n  ${memories.length} herinneringen gevonden:\n`);
      for (const m of memories) {
        const date = new Date(m.createdAt).toLocaleString('nl-NL');
        console.log(`  [${date}] ${m.memoryType} — ${m.trigger?.slice(0, 60) ?? '?'}...`);
      }
    } else {
      console.log('  Geen herinneringen (gebruiker bestaat mogelijk niet in DB)');
    }
  } else {
    console.log(`\n  ✗ FOUT: ${response.error}`);
  }

  console.log('\n══════════════════════════════════════════════════');
  console.log(`  STATUS: ${response.ok ? 'ORION OPERATIONEEL ✓' : 'FOUT ✗'}`);
  console.log('══════════════════════════════════════════════════\n');

  process.exit(response.ok ? 0 : 1);
}

main().catch((err) => {
  console.error('\n[FOUT]', err.message);
  process.exit(1);
});
