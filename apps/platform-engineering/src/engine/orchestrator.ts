import * as fs from 'fs';
import * as path from 'path';
import { ExecutionContext, IVerificationLayer, VerificationResult, AIProvider } from '../core/interfaces';
import { HistoryEngine } from '../knowledge/history-engine';
import { Layer0Constitution } from '../layers/layer0-constitution';
import { Layer1Repository } from '../layers/layer1-repository';
import { Layer2Build } from '../layers/layer2-build';
import { OllamaProvider } from '../providers/ollama-provider';

export class DIVPOrchestrator {
  private layers: IVerificationLayer[] = [];
  private aiProvider: AIProvider;
  private historyEngine: HistoryEngine;

  constructor() {
    this.aiProvider = new OllamaProvider();
    const historyPath = path.join(process.cwd(), '.divp-history.json');
    this.historyEngine = new HistoryEngine(historyPath);
  }

  // Dynamically register a capability
  registerCapability(layer: IVerificationLayer) {
    this.layers.push(layer);
    // Sort layers by their execution order (layer property)
    this.layers.sort((a, b) => a.capability.layer - b.capability.layer);
  }

  async run(context: ExecutionContext) {
    console.log(`\n======================================================`);
    console.log(`🚀 R.Y.L AEIP Deployment Intelligence & Verification`);
    console.log(`   Scan ID: ${context.manifest.id}`);
    console.log(`======================================================\n`);

    const results: VerificationResult[] = [];
    let overallConfidence = 100;
    let shouldBlock = false;

    // Execute Pipeline
    for (const layer of this.layers) {
      console.log(`[${layer.capability.layer}] Executing Capability: ${layer.capability.id}...`);
      await layer.initialize();
      
      const result = await layer.execute(context);
      results.push(result);

      if (result.status === 'FATAL' || result.status === 'FAIL') {
        console.log(`   ❌ FAIL: ${result.findings.map(f => f.code).join(', ')}`);
        
        // AI Diagnosis
        const evidenceStr = result.evidence ? result.evidence.toString() : result.findings.map(f => f.message).join(' | ');
        console.log(`   🤖 Consulting AI Provider (${this.aiProvider.name}) for root cause...`);
        try {
           const aiDiag = await this.aiProvider.analyzeError(evidenceStr, {});
           console.log(`      -> Root Cause: ${aiDiag.rootCause}`);
           console.log(`      -> Suggested Fix: ${aiDiag.suggestedFix}`);
           console.log(`      -> Confidence: ${aiDiag.confidence}%`);
        } catch (e: any) {
           console.log(`      -> AI Consultation Failed: ${e.message}`);
        }

        shouldBlock = true;
        overallConfidence = Math.min(overallConfidence, result.confidence);
        break; // Fast fail
      } else if (result.status === 'WARN') {
        console.log(`   ⚠️ WARN: ${result.findings.length} findings`);
        overallConfidence = Math.min(overallConfidence, result.confidence);
      } else {
        console.log(`   ✅ PASS`);
      }
      
      await layer.cleanup();
    }

    // Generate Reports & Save History
    console.log(`\n======================================================`);
    console.log(`📊 DIVP Execution Complete`);
    console.log(`   Overall Confidence: ${overallConfidence}%`);
    console.log(`   Recommendation: ${shouldBlock ? 'BLOCK DEPLOYMENT' : 'SAFE TO DEPLOY'}`);
    console.log(`======================================================\n`);

    this.historyEngine.saveRun({
      timestamp: new Date().toISOString(),
      runId: context.manifest.id,
      overallConfidence,
      layers: results.reduce((acc, r) => ({ ...acc, [r.layerId]: r.status }), {}),
      errors: results.flatMap(r => r.findings.map(f => f.code))
    });
  }
}
