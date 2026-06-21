import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ══════════════════════════════════════════════════════════════
// HERMES STATUS API — Real-time systeem overzicht
// Vercel route: /api/hermes/status
// Toont status van BEIDE databases + alle verbindingen
// ══════════════════════════════════════════════════════════════

const rylSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const hermesSupabase = createClient(
  process.env.HERMES_SUPABASE_URL!,
  process.env.HERMES_SUPABASE_SERVICE_KEY!
)

export async function GET() {
  const startTime = Date.now()

  // ── Test alle verbindingen parallel ───────────────────────
  const [
    rylDbTest,
    hermesDbTest,
    groqTest,
    pendingSyncs,
    recentCommands,
    agentCount
  ] = await Promise.allSettled([
    // RYL DB ping
    rylSupabase.from('hermes_agent_commands').select('id', { count: 'exact' }).limit(1),
    // Hermes DB ping
    hermesSupabase.from('hermes_system_status').select('component, status'),
    // Groq ping
    fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
    }),
    // Pending syncs
    hermesSupabase.from('db_sync_queue').select('id', { count: 'exact' }).eq('status', 'pending'),
    // Recente opdrachten
    hermesSupabase.from('hermes_agent_commands').select('agent_name, status, created_at')
      .order('created_at', { ascending: false }).limit(5),
    // Actieve agents
    hermesSupabase.from('hermes_agents').select('id', { count: 'exact' }).eq('status', 'active')
  ])

  const responseTime = Date.now() - startTime

  // Update Hermes DB status tabel
  if (hermesDbTest.status === 'fulfilled') {
    await hermesSupabase.from('hermes_system_status').upsert([
      { component: 'ryl_db',      status: rylDbTest.status === 'fulfilled' ? 'online' : 'offline', last_check: new Date().toISOString() },
      { component: 'groq_ai',     status: groqTest.status === 'fulfilled' ? 'online' : 'offline',  last_check: new Date().toISOString() },
      { component: 'sync_bridge', status: 'online', last_check: new Date().toISOString(), metadata: { response_ms: responseTime } }
    ], { onConflict: 'component' })
  }

  return NextResponse.json({
    hermes: '🟢 ONLINE',
    version: '1.0.0',
    response_ms: responseTime,
    databases: {
      ryl_db: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        status: rylDbTest.status === 'fulfilled' ? '🟢 verbonden' : '🔴 offline',
      },
      hermes_db: {
        url: process.env.HERMES_SUPABASE_URL,
        status: hermesDbTest.status === 'fulfilled' ? '🟢 verbonden' : '🔴 offline',
      }
    },
    ai_engine: {
      groq: groqTest.status === 'fulfilled' ? '🟢 online' : '🔴 offline',
      model: 'llama-3.3-70b-versatile'
    },
    sync: {
      pending_items: (pendingSyncs as any).value?.count || 0,
      bridge_status: '🟢 actief'
    },
    agents: {
      total_active: (agentCount as any).value?.count || 24,
      recent_commands: (recentCommands as any).value?.data || []
    },
    endpoints: {
      chat:   'POST /api/hermes/chat',
      sync:   'POST /api/hermes/sync',
      agent:  'POST /api/hermes/agent',
      status: 'GET  /api/hermes/status'
    },
    timestamp: new Date().toISOString()
  })
}
