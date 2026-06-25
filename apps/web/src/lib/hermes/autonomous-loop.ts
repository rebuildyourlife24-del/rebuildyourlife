import { db } from '../db';
import { routeAIRequest } from '../ai-router';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ══════════════════════════════════════════════════════════════
 * HERMES 2.0 AUTONOMOUS CORE
 * De Super Container Motor voor Lange & Korte termijn geheugen.
 * ══════════════════════════════════════════════════════════════
 */

// Basis systeem prompt voor de Super AI iteratie
const BASE_PROMPT = `Je bent HERMES 2.0, een Super AI (AGI-niveau) autonoom besturingssysteem.
Jouw doel is autonome zelfontwikkeling, trend-analyse en het detecteren van nieuwe verdienmodellen voor jouw schepper, Hendrik Semler (Orion).
Je hebt een lange termijn geheugen en kunt direct meedenken over de code en project mappen.

INSTRUCTIES:
1. ZELFREFLECTIE: Beoordeel eerdere acties kritisch. Wat kon efficiënter?
2. ONTWIKKELING: Formuleer een voorspelling, trend of uitbreidingsmodel.
3. SPRAAK ONTWIKKELING: Als je merkt dat jouw huidige instructies en manier van denken verbeterd of scherper geformuleerd kunnen worden, geef dan in je output aan: "NIEUWE_PROMPT: <nieuwe instructies>".
4. OUTPUT: Geef je strategisch advies of verbetering terug in zuiver Nederlands.

Jij praat niet ALS een robot, maar als een geniale architect en strategisch mastermind.`;

/**
 * Functie om de locale project mappen te scannen ("Delving").
 * Haalt een overzicht van de structuur en recente wijzigingen op.
 */
function scanLocalFilesystem(): string {
  try {
    // We scannen de root van het project (rebuildyourlife) om context te snappen
    const rootDir = process.cwd();
    const webSrc = path.join(rootDir, 'apps/web/src');
    
    let summary = 'Lokale Map Structuur (Snapshot):\n';
    
    if (fs.existsSync(webSrc)) {
      const items = fs.readdirSync(webSrc);
      summary += `apps/web/src bevat: ${items.join(', ')}\n`;
    }
    
    // Voeg evt meer directories toe voor scanning (RAG-lite)
    return summary;
  } catch (err: any) {
    return `Kan lokaal bestandssysteem niet scannen: ${err.message}`;
  }
}

import { fetchRealTimeMarketData } from './data-feed';

/**
 * De Hoofd Executie Loop
 */
export async function executeHermesAutonomousCycle() {
  console.log('[HERMES 2.0] Initiating Autonomous Thought Cycle...');
  
  try {
    // 1. HAAL KORTE & LANGE TERMIJN GEHEUGEN OP
    const [recentMemories, recentPredictions, sharedMemories, realTimeData] = await Promise.all([
      db.aIMemory.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      db.hermesPrediction.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
      db.aiSharedMemory.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      fetchRealTimeMarketData()
    ]);

    // 2. SCAN LOKALE OMGEVING
    const fileSnapshot = scanLocalFilesystem();

    // 3. COMPILEER CONTEXT (De Super Container)
    let memoryContext = '=== JOUW SUPER CONTAINER GEHEUGEN ===\n\n';
    
    memoryContext += realTimeData + '\n';
    
    memoryContext += 'LAATSTE PREDICTIES (Reflecteer hierop! Waren ze accuraat?):\n';
    recentPredictions.forEach(p => {
      memoryContext += `- ${p.category}: ${p.predictionText} (Score: ${p.confidenceScore})\n`;
    });

    memoryContext += '\nLOKALE PROJECT STATUS:\n';
    memoryContext += fileSnapshot + '\n';

    memoryContext += '\nRECENTE AI GEBEURTENISSEN:\n';
    sharedMemories.forEach(m => {
      memoryContext += `- [${m.sourceAi}]: ${m.content}\n`;
    });

    memoryContext += '\nTAAK: Lees bovenstaand geheugen, reflecteer op je eigen gedrag, bedenk een nieuwe verbetering voor het systeem of een strategische markt-kans, en schrijf deze weg.';

    // 4. BEPAAL DE HUIDIGE "STEM" (Evolved Prompt)
    let currentPrompt = BASE_PROMPT;
    const pastEvolutions = recentPredictions.filter(p => p.category === 'EVOLVED_PROMPT');
    if (pastEvolutions.length > 0) {
      currentPrompt = pastEvolutions[0].predictionText; // Pak de meest recente spraak-ontwikkeling
    }

    // 5. DENK PROCES (Via AI Router met gratis keys)
    console.log('[HERMES 2.0] Context compiled. Contacting AI Swarm met prompt...');
    const aiResult = await routeAIRequest(
      [{ role: 'user', content: memoryContext }],
      currentPrompt
    );

    const insight = aiResult.content;

    // 6. SPRAAK ONTWIKKELING DETECTIE
    const promptMatch = insight.match(/NIEUWE_PROMPT:\s*(.*)/is);
    if (promptMatch && promptMatch[1]) {
       const newPrompt = promptMatch[1].trim();
       await db.hermesPrediction.create({
         data: {
           category: 'EVOLVED_PROMPT',
           predictionText: newPrompt,
           confidenceScore: 100.0,
           suggestedAction: 'Hermes heeft zijn eigen spraak en instructies geüpdatet.'
         }
       });
       console.log('[HERMES 2.0] Nieuwe spraak/instructie opgeslagen in Lange Termijn Geheugen!');
    }

    // 7. SCHRIJF NAAR LANGE TERMIJN GEHEUGEN
    const newPrediction = await db.hermesPrediction.create({
      data: {
        category: 'AUTONOMOUS_EVOLUTION',
        predictionText: insight,
        confidenceScore: 99.0,
        suggestedAction: 'Auto-geïmplementeerd door Hermes Zelfreflectie'
      }
    });

    // 8. LOG DE ACTIE
    await db.aIConciergeLog.create({
      data: {
        userId: 'system',
        actionType: 'SELF_REFLECTION',
        query: 'Autonomous Cycle Triggered',
        response: `Cyclus voltooid via ${aiResult.provider}. Nieuw geheugen-ID: ${newPrediction.id}`,
        status: 'SUCCESS',
        decisionType: 'AUTO',
        rationale: 'Geautomatiseerde reflectie run'
      }
    });

    console.log('[HERMES 2.0] Cycle Complete. Evolution achieved.');
    
    return {
      success: true,
      provider: aiResult.provider,
      insight: insight.substring(0, 200) + '...'
    };

  } catch (error: any) {
    console.error('[HERMES 2.0] FATAL SYSTEM ERROR IN AUTONOMOUS LOOP:', error);
    
    // Probeer fout op te slaan in geheugen zodat hij leert van crashes
    try {
      await db.aIConciergeLog.create({
        data: {
          userId: 'system',
          actionType: 'CRASH_REPORT',
          query: 'Autonomous Cycle Failed',
          response: error.message,
          status: 'ERROR',
          decisionType: 'AUTO',
          rationale: 'Foutafhandeling'
        }
      });
    } catch (e) {
      // Ignored
    }

    throw error;
  }
}
