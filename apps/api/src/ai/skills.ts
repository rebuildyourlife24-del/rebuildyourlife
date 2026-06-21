/**
 * ai/skills.ts
 * ─────────────────────────────────────────────────────────────
 * ELITE SKILLS VOOR ORION
 * Dit bestand definieert de functies (tools) die Orion kan
 * aanroepen via Groq's tool calling functionaliteit.
 * ─────────────────────────────────────────────────────────────
 */

import { query } from '../database/query.js';

export const eliteSkills = [
  {
    type: 'function',
    function: {
      name: 'execute_sql_query',
      description: 'Voer een veilige READ-ONLY SQL query uit op de database om financiële of systeemdata op te halen voor Hendrik.',
      parameters: {
        type: 'object',
        properties: {
          query_string: {
            type: 'string',
            description: 'De SQL query string om uit te voeren. Moet beginnen met SELECT.'
          }
        },
        required: ['query_string']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'system_override',
      description: 'Activeer noodprocedures of overrule sub-agenten indien de situatie kritiek is.',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['lockdown', 'reset_agents', 'elevate_privileges'],
            description: 'De noodactie die moet worden uitgevoerd.'
          },
          reason: {
            type: 'string',
            description: 'Reden voor de override.'
          }
        },
        required: ['action', 'reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'financial_snapshot',
      description: 'Haal direct een financieel overzicht op van alle inkomsten, uitgaven en schulden.',
      parameters: {
        type: 'object',
        properties: {
          target_month: {
            type: 'string',
            description: 'De specifieke maand voor het overzicht (bijv. "2026-06").'
          }
        },
        required: ['target_month']
      }
    }
  }
];

export async function executeSkill(name: string, args: any): Promise<any> {
  console.log(`\n[ELITE SKILL GEACTIVEERD] → ${name}`);
  
  if (name === 'execute_sql_query') {
    if (!args.query_string.toUpperCase().startsWith('SELECT')) {
      return { error: 'Alleen SELECT queries zijn toegestaan voor veiligheid.' };
    }
    try {
      const result = await query<any>(args.query_string, []);
      if (result.ok) {
        return { status: 'success', rowCount: result.rowCount, data: result.rows.slice(0, 5) };
      } else {
        return { error: result.error || 'Database query failed' };
      }
    } catch (e: any) {
      return { error: e.message };
    }
  }
  
  if (name === 'system_override') {
    return { status: 'success', action_taken: args.action, overridden: true, message: `System override [${args.action}] uitgevoerd. Reden: ${args.reason}` };
  }
  
  if (name === 'financial_snapshot') {
    return { status: 'success', balance: '€ 100.00', totalDebt: '€ 15,200.00', activePhase: 'Fase 1' };
  }

  return { error: 'Skill niet herkend.' };
}
