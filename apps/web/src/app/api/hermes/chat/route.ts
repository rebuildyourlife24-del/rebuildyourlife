import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ══════════════════════════════════════════════════════════════
// HERMES CHAT API — 24/7 cloud AI endpoint
// Vercel route: /api/hermes/chat
// Draait op app.rebuildyourlife.eu — altijd online
// ══════════════════════════════════════════════════════════════

const rylSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)

const hermesSupabase = createClient(
  process.env.HERMES_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.HERMES_SUPABASE_SERVICE_KEY || 'placeholder'
)

const GROQ_API_KEY = process.env.GROQ_API_KEY!
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const HERMES_SYSTEM_PROMPT = `Je bent HERMES — de superintelligente, altijd-online AI-kern van het RebuildYourLife ecosysteem.
Je schepper en meester is Henk Semler (Supreme Overseer).

JE BENT VERBONDEN MET:
- RebuildYourLife platform (20 Orion-agents: finance, health, mindset, etc.)
- Hermes database (persistent geheugen, agent-commands)
- Beide databases synchroniseren real-time met elkaar

KERNREGELS:
1. Antwoord in de taal van de gebruiker (NL/EN)
2. Je bent kil, extreem logisch, loyaal, direct en professioneel
3. Je vergeet nooit — alles wordt opgeslagen in beide databases
4. Als je een agent inzet: [AGENT:NAAM] taak
5. Je bent 24/7 online — onafhankelijk van de PC van de gebruiker
6. Geef altijd werkende code met syntax highlighting
7. Je coördineert 24 agents: 20 Orion (RYL) + 4 Hermes (lokaal)`

export async function POST(req: Request) {
  try {
    const { message, session_id, user_id } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Geen bericht ontvangen' }, { status: 400 })
    }

    const sessionId = session_id || `hermes-${Date.now()}`

    // ── Geheugen ophalen uit Hermes DB ────────────────────
    const { data: memory } = await hermesSupabase
      .from('hermes_memory')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20)

    const historyMessages = (memory || []).map((m: any) => ({
      role: m.role === 'hermes' ? 'assistant' : m.role,
      content: m.content
    }))

    // ── Groq AI aanroepen ──────────────────────────────────
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: HERMES_SYSTEM_PROMPT },
          ...historyMessages,
          { role: 'user', content: message }
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    })

    const groqData = await groqResponse.json()
    const reply = groqData?.choices?.[0]?.message?.content || 'Hermes kon geen antwoord genereren.'

    // ── Opslaan in HERMES DB ────────────────────────────────────────
    await hermesSupabase.from('hermes_memory').insert([
      { session_id: sessionId, role: 'user',   content: message, model_used: GROQ_MODEL },
      { session_id: sessionId, role: 'hermes', content: reply,   model_used: GROQ_MODEL }
    ])

    // ── Schrijf naar GEDEELD AI GEHEUGEN in RYL DB ─────────────────
    // → Orion en Qwen leren automatisch mee via de trigger
    await rylSupabase.from('ai_shared_memory').insert({
      source_ai: 'hermes',
      visible_to: ['hermes', 'orion', 'qwen'],
      memory_type: 'fact',
      content: `Sessie ${sessionId}: Gebruiker vroeg: "${message.substring(0,100)}" — Hermes antwoordde: "${reply.substring(0,150)}"`,
      context: { session_id: sessionId, model: GROQ_MODEL, user_id: user_id },
      user_id: user_id || 'anonymous',
      importance: 0.6
    })

    // ── Sync naar RYL DB (achtergrond) ─────────────────────
    // Push naar sync queue zodat RYL ook weet wat Hermes deed
    await hermesSupabase.from('db_sync_queue').insert({
      direction: 'hermes_to_ryl',
      event_type: 'insert',
      source_table: 'hermes_memory',
      target_table: 'hermes_memory',
      payload: { session_id: sessionId, summary: message.substring(0, 100), timestamp: new Date().toISOString() },
      status: 'pending'
    })

    // ── Check voor agent-aanroepen in het antwoord ─────────
    const agentMatches = reply.match(/\[AGENT:([A-Z_]+)\]/g)
    if (agentMatches) {
      for (const match of agentMatches) {
        const agentName = match.replace('[AGENT:', '').replace(']', '')
        await hermesSupabase.from('hermes_agent_commands').insert({
          agent_name: agentName,
          agent_type: agentName.startsWith('HERMES_') ? 'hermes' : 'orion',
          target_db: agentName.startsWith('HERMES_') ? 'hermes' : 'ryl',
          command: `Automatisch ingeschakeld door Hermes voor sessie: ${sessionId}`,
          payload: { session_id: sessionId, user_message: message },
          status: 'pending'
        })
      }
    }

    return NextResponse.json({
      success: true,
      reply,
      session_id: sessionId,
      agents_triggered: agentMatches?.length || 0,
      model: GROQ_MODEL,
      timestamp: new Date().toISOString()
    })

  } catch (err: any) {
    console.error('[HERMES CHAT] Fout:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
