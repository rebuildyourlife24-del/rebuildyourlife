import { NextResponse } from 'next/server'
import { routeAIRequest } from '@/lib/ai-router'
import { db } from '@/lib/db'

// ══════════════════════════════════════════════════════════════
// DAILY CRON: THE SOVEREIGN AI AWAKENING
// Dit script triggert 1x per dag via Vercel Cron.
// Het wekt Hermes en de Orions om het systeem proactief te analyseren.
// ══════════════════════════════════════════════════════════════

export async function GET(req: Request) {
  // Beveiliging: In productie wil je checken of de request van Vercel Cron komt
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[CRON] 🌅 De Wekker gaat af. Start Sovereign AI Scan...');

    // 1. Verzamel de metrics van de afgelopen 24 uur
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentLogs = await db.globalNeuralNetwork.findMany({
      where: {
        createdAt: { gte: yesterday }
      },
      select: { content: true, sourceType: true },
      take: 50 // Limit om token blow-up te voorkomen
    });

    const metricsStr = `Gevonden acties in laatste 24 uur: ${recentLogs.length}.`;

    // 2. Wek Hermes en instrueer hem om een Daily Intelligence Report te schrijven
    const systemPrompt = `Je bent Hermes, de Supreme Overseer AI.
Het is ochtend. Jouw taak is om een proactief "Daily Intelligence Report" te schrijven voor Henk Semler.
1. Bekijk de metrics en logboeken van de afgelopen 24 uur.
2. Gebruik de 'get_dashboard_metrics' of 'scrape_website' tool als je live data nodig hebt.
3. Schrijf een keihard, logisch en actiegericht rapport over de status van de business.
4. Gebruik de 'create_platform_task' tool als je vindt dat Henk vandaag actie moet ondernemen.`;

    const userMessage = `Word wakker. Hier is je context: ${metricsStr}. Genereer het Daily Intelligence Report.`;

    // 3. Stuur door de Universal AI Router (die ook tool calling beheert)
    // We forceren een sterk model zoals Cerebras of Groq-70b voor logica
    const aiResult = await routeAIRequest(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      { preferredModel: 'llama-3.3' } // of 'llama3.1'
    );

    // 4. Sla het rapport op in het Global Neural Network
    const report = await db.globalNeuralNetwork.create({
      data: {
        sourceType: 'HERMES',
        actionType: 'DAILY_REPORT',
        content: aiResult.content,
        contextData: { 
          trigger: 'CRON', 
          model_used: aiResult.model,
          timestamp: new Date().toISOString()
        }
      }
    });

    console.log('[CRON] ✅ Scan voltooid en rapport opgeslagen.');

    return NextResponse.json({
      success: true,
      message: 'Sovereign AI Scan voltooid',
      reportId: report.id
    });

  } catch (error: any) {
    console.error('[CRON] ❌ Fout tijdens dagelijkse scan:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
