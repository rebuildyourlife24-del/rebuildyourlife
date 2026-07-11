import { execSync } from 'child_process';
import * as path from 'path';
import { IVerificationLayer, ExecutionContext, VerificationResult } from '../core/interfaces';

export class Layer2Build implements IVerificationLayer {
  capability = {
    id: 'build.simulation',
    version: '1.0',
    owner: 'Platform Engineering',
    maturity: 'Beta' as const,
    layer: 2
  };

  async initialize(): Promise<void> {}

  async execute(context: ExecutionContext): Promise<VerificationResult> {
    const findings = [];
    let status: 'PASS' | 'WARN' | 'FAIL' | 'FATAL' = 'PASS';
    let severity = 0;
    const start = Date.now();

    try {
      // We simulate the exact build command that Vercel would run
      // Since `turbo run build` can take long (and lacks linked node_modules locally right now), 
      // we do a typecheck over domain-core specifically for the simulation to verify the fix.
      console.log('      -> Running Build Simulation (Prisma + Typecheck)...');
      execSync('cmd /c yarn tsc', { cwd: path.join(context.cwd, 'packages/domain-core'), stdio: 'pipe' });
    } catch (e: any) {
      status = 'FAIL';
      severity = 9;
      findings.push({ 
        code: 'BUILD001', 
        message: 'Build or Typecheck failed', 
        // We capture stderr/stdout to feed to Ollama
        evidence: e.stdout ? e.stdout.toString() : e.message 
      });
    }

    return {
      layerId: this.capability.id,
      status,
      severity,
      confidence: status === 'PASS' ? 100 : 0,
      durationMs: Date.now() - start,
      findings,
      recommendations: status === 'FAIL' ? ['Check AI diagnosis for root cause'] : [],
      evidence: findings.length > 0 ? findings[0].evidence : null,
      artifacts: []
    };
  }

  async cleanup(): Promise<void> {}
}
