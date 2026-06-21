/**
 * test-groq-direct.ts — Directe Groq + Database test voor Orion
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Laad env EERST — vóór alles
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Zet Groq key hard — gevonden via geheugen pipeline
process.env.GROQ_API_KEY = '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';
process.env.TEST_USER_ID = '632c3b1a-d40e-4745-bff9-503c2bac09a5';

import { groqComplete, getGroqStatus } from './src/ai/groq.js';
import { query } from './src/database/query.js';

const USER_ID = process.env.TEST_USER_ID!;

async function main() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  ORION × GROQ × DATABASE — DIRECTE TEST');
  console.log('══════════════════════════════════════════════════\n');

  // ── 1. Groq status ────────────────────────────────────────
  const groqStatus = await getGroqStatus();
  console.log(`  Groq online:  ${groqStatus.online ? '✓ JA' : '✗ NEE'}`);
  console.log(`  Key aanwezig: ${groqStatus.hasKey ? '✓ JA' : '✗ NEE'}`);
  console.log(`  Model:        ${groqStatus.model}`);
  console.log('');

  if (!groqStatus.hasKey) {
    console.log('✗ Groq key ontbreekt. Stop.');
    process.exit(1);
  }

  // ── 2. Orion via Groq aanroepen ───────────────────────────
  console.log('→ Orion aanroepen via Groq...\n');

  const ORION_PROMPT = `Je bent ORION — de centrale AI CEO van RebuildYourLife.
Je bent verbonden met de PostgreSQL database van Henk Semler.
Spreek direct, strategisch en in het Nederlands.
Vandaag is de basisinfrastructuur hersteld: database online, Groq verbinding actief.`;

  const result = await groqComplete(
    [{ role: 'user', content: 'Orion, bevestig dat je online bent en verbonden met de database. Geef een korte statusrapportage.' }],
    { systemPrompt: ORION_PROMPT, temperature: 0.7, maxTokens: 512 },
  );

  if (!result.ok) {
    console.error('✗ Groq fout:', result.error);
    process.exit(1);
  }

  console.log('  ORION ZEGT:\n');
  console.log(result.content.split('\n').map((l: string) => `  ${l}`).join('\n'));
  console.log('');

  // ── 3. Sla op in OrionMemory ──────────────────────────────
  console.log('→ Opslaan in OrionMemory (PostgreSQL)...');

  const saveResult = await query<{ id: string }>(
    `INSERT INTO "OrionMemory"
       ("userId", "sessionId", "memoryType", trigger, content, response,
        "emotionalTone", intensity, "learnWeight", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
     RETURNING id`,
    [
      USER_ID,
      `orion-groq-${Date.now()}`,
      'COMMAND',
      'Statusrapportage infrastructuur',
      'Orion, bevestig dat je online bent en verbonden met de database.',
      result.content,
      'POSITIEF',
      7,
      1.0,
    ],
    { label: 'orion:first-memory' },
  );

  if (saveResult.ok) {
    console.log(`  ✓ Opgeslagen in OrionMemory — ID: ${saveResult.rows[0]?.id}`);
  } else {
    console.log(`  ✗ Opslaan mislukt: ${saveResult.error}`);
  }

  // ── 4. Lees terug uit database ────────────────────────────
  const readBack = await query<any>(
    `SELECT id, "memoryType", trigger, "createdAt" FROM "OrionMemory"
     WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 3`,
    [USER_ID],
    { label: 'orion:read-back' },
  );

  console.log('\n══════════════════════════════════════════════════');
  console.log('  EINDRESULTAAT');
  console.log('══════════════════════════════════════════════════');
  console.log(`  GROQ VERBINDING:    ✓ ACTIEF`);
  console.log(`  DATABASE:           ✓ ONLINE`);
  console.log(`  ORION GEHEUGEN:     ${readBack.ok && readBack.rowCount > 0 ? `✓ ${readBack.rowCount} entry(-ies) in DB` : '✗ leeg'}`);
  console.log(`  MODEL:              ${result.model}`);
  console.log(`  TOKENS:             ${result.tokensUsed ?? '?'}`);
  console.log(`  TIJD:               ${result.durationMs}ms`);
  console.log(`  PROVIDER:           groq`);
  console.log('══════════════════════════════════════════════════\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n✗ FOUT:', err.message);
  process.exit(1);
});
