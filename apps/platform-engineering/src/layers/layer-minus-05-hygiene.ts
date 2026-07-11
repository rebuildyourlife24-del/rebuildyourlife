import * as fs from 'fs';
import * as path from 'path';
import { IVerificationLayer, ExecutionContext, VerificationResult } from '../core/interfaces';

export class LayerMinus05Hygiene implements IVerificationLayer {
  capability = {
    id: 'repository.hygiene',
    version: '1.0',
    owner: 'Platform Engineering',
    maturity: 'Beta' as const,
    layer: -0.5
  };

  async initialize(): Promise<void> {}

  async execute(context: ExecutionContext): Promise<VerificationResult> {
    const findings = [];
    let status: 'PASS' | 'WARN' | 'FAIL' | 'FATAL' = 'PASS';
    let severity = 0;

    const packagesDir = path.join(context.cwd, 'packages');
    
    // 1. Check for duplicate lockfiles
    const hasYarnLock = fs.existsSync(path.join(context.cwd, 'yarn.lock'));
    const hasPackageLock = fs.existsSync(path.join(context.cwd, 'package-lock.json'));
    if (hasYarnLock && hasPackageLock) {
      findings.push({ code: 'HYG001', message: 'Duplicate lockfiles (yarn.lock and package-lock.json)' });
      status = 'FAIL';
      severity = 8;
    }

    // 2. Check for scripts outside src in packages that have rootDir=src
    if (fs.existsSync(packagesDir)) {
      const packages = fs.readdirSync(packagesDir);
      for (const pkg of packages) {
        const pkgPath = path.join(packagesDir, pkg);
        const tsconfigPath = path.join(pkgPath, 'tsconfig.json');
        
        if (fs.existsSync(tsconfigPath)) {
          const content = fs.readFileSync(tsconfigPath, 'utf8');
          // simple check
          if (content.includes('"rootDir": "./src"') || content.includes('"rootDir":"./src"') || content.includes('"rootDir": "src"')) {
            const scriptsDir = path.join(pkgPath, 'scripts');
            if (fs.existsSync(scriptsDir)) {
               // Check if it's explicitly excluded
               if (!content.includes('"scripts"') || !content.includes('"exclude"')) {
                 findings.push({ 
                   code: 'HYG002', 
                   message: `Package ${pkg} has scripts/ folder but rootDir is src, and scripts is not excluded. This will cause TS6059.`,
                   file: tsconfigPath
                 });
                 status = 'WARN';
               }
            }
          }
        }
      }
    }

    return {
      layerId: this.capability.id,
      status,
      severity,
      confidence: status === 'PASS' ? 100 : (status === 'FAIL' ? 60 : 80),
      durationMs: 25,
      findings,
      recommendations: status === 'FAIL' || status === 'WARN' ? ['Review repository hygiene warnings'] : [],
      evidence: null,
      artifacts: []
    };
  }

  async cleanup(): Promise<void> {}
}
