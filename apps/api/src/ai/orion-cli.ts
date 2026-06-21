/**
 * ai/orion-cli.ts
 * ─────────────────────────────────────────────────────────────
 * ORION TERMINAL FALLBACK
 * De kogelvrije noodlijn. Als alle web interfaces plat liggen
 * of tokens opraken, start je dit. Werkt volledig via Groq.
 * ─────────────────────────────────────────────────────────────
 */

import readline from 'readline';
import { orionChat } from './orion.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../database/query.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../packages/database/.env'), override: false });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();
console.log('══════════════════════════════════════════════════════════════');
console.log('  ORION SUPREME TERMINAL — DIRECT OVERRIDE ACTIVE');
console.log('══════════════════════════════════════════════════════════════');
console.log('  Status: Verbonden met Database & Groq Llama 3.3 70B');
console.log('  Typ "exit" of "quit" om te sluiten.');
console.log('──────────────────────────────────────────────────────────────\n');

async function getAdminUserId() {
  const result = await query<any>(
    `SELECT id, email, "firstName" FROM "User" WHERE role = 'ADMIN' OR role = 'SUPER_ADMIN' LIMIT 1`,
    []
  );
  if (result.ok) {
    return result.rows[0]?.id || 'admin-fallback-id';
  }
  return 'admin-fallback-id';
}

async function startTerminal() {
  const userId = await getAdminUserId();
  const sessionId = `cli-${Date.now()}`;

  function ask() {
    rl.question('\n[CEO Hendrik] > ', async (input) => {
      if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        console.log('\n[ORION] Systeem afgesloten. Tot ziens.');
        rl.close();
        process.exit(0);
      }

      if (!input.trim()) return ask();

      process.stdout.write('[ORION is aan het denken...]\r');

      try {
        const response = await orionChat(userId, input, sessionId, 'groq' as any);
        process.stdout.write('                          \r'); // clear thinking line
        console.log(`\n[ORION] ${response.reply}\n`);
      } catch (err: any) {
        process.stdout.write('                          \r');
        console.log(`\n[ERROR] Kan Orion niet bereiken: ${err.message}\n`);
      }

      ask();
    });
  }

  ask();
}

startTerminal();
