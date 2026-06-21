import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ══════════════════════════════════════════════════════════════
// HERMES SYNC WEBHOOK — In RYL database (app.rebuildyourlife.eu)
// Vercel route: /api/hermes/sync
//
// RYL DB stuurt events naar Hermes DB via dit endpoint
// Hermes DB stuurt events naar RYL DB via webhook → dit endpoint
// ══════════════════════════════════════════════════════════════

// RYL Supabase (deze database)
const rylSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)

// Hermes Supabase (andere database)
const hermesSupabase = createClient(
  process.env.HERMES_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.HERMES_SUPABASE_SERVICE_KEY || 'placeholder'
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { direction, event_type, source_table, target_table, payload } = body

    // Beveiligingscheck
    const authHeader = req.headers.get('x-hermes-sync-secret')
    if (authHeader !== process.env.HERMES_SYNC_SECRET) {
      return NextResponse.json({ error: 'Ongeautoriseerd' }, { status: 401 })
    }

    // ── RYL → Hermes sync ──────────────────────────────────
    if (direction === 'ryl_to_hermes') {
      await syncRYLToHermes(event_type, source_table, target_table, payload)
    }
    // ── Hermes → RYL sync ──────────────────────────────────
    else if (direction === 'hermes_to_ryl') {
      await syncHermesToRYL(event_type, source_table, target_table, payload)
    }

    return NextResponse.json({ success: true, synced_at: new Date().toISOString() })

  } catch (err: any) {
    console.error('[HERMES SYNC] Fout:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ── RYL data → Hermes mirror ───────────────────────────────────
async function syncRYLToHermes(event: string, srcTable: string, tgtTable: string, payload: any) {
  console.log(`[SYNC RYL→HERMES] ${event} op ${srcTable}`)

  if (event === 'DELETE') {
    await hermesSupabase.from(tgtTable).delete().eq('id', payload.id)
    return
  }

  // Upsert in Hermes mirror tabel
  const { error } = await hermesSupabase
    .from(tgtTable)
    .upsert({ ...payload, last_synced: new Date().toISOString() }, { onConflict: 'id' })

  if (error) throw new Error(`Hermes upsert fout: ${error.message}`)

  // Log in Hermes sync queue
  await hermesSupabase.from('db_sync_queue').insert({
    direction: 'ryl_to_hermes',
    event_type: event,
    source_table: srcTable,
    target_table: tgtTable,
    payload,
    status: 'done',
    processed_at: new Date().toISOString()
  })
}

// ── Hermes commando → RYL uitvoeren ──────────────────────────
async function syncHermesToRYL(event: string, srcTable: string, tgtTable: string, payload: any) {
  console.log(`[SYNC HERMES→RYL] ${event} op ${tgtTable}`)

  if (tgtTable === 'hermes_agent_commands') {
    // Hermes stuurt een agent-opdracht door naar RYL
    const { data, error } = await rylSupabase
      .from('hermes_agent_commands')
      .insert({
        ...payload,
        synced_from_hermes: true,
        synced_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(`RYL agent command fout: ${error.message}`)

    // Stuur het RYL ID terug naar Hermes
    await hermesSupabase
      .from('hermes_agent_commands')
      .update({ ryl_command_id: data.id, synced_at: new Date().toISOString() })
      .eq('id', payload.id)
    return
  }

  // Generieke upsert naar RYL
  const { error } = await rylSupabase
    .from(tgtTable)
    .upsert(payload, { onConflict: 'id' })

  if (error) throw new Error(`RYL upsert fout: ${error.message}`)
}

// ── GET: Sync status ophalen ──────────────────────────────────
export async function GET() {
  const [rylStatus, hermesStatus] = await Promise.allSettled([
    rylSupabase.from('hermes_agent_commands').select('id', { count: 'exact' }).limit(1),
    hermesSupabase.from('db_sync_queue').select('status', { count: 'exact' }).limit(1)
  ])

  return NextResponse.json({
    sync_bridge: 'online',
    ryl_db: rylStatus.status === 'fulfilled' ? 'connected' : 'error',
    hermes_db: hermesStatus.status === 'fulfilled' ? 'connected' : 'error',
    timestamp: new Date().toISOString()
  })
}
