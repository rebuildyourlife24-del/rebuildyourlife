import * as fs from 'fs';
import * as path from 'path';
import { IVerificationLayer, ExecutionContext, VerificationResult } from '../core/interfaces';

export class Layer1Repository implements IVerificationLayer {
  capability = {
    id: 'repository.audit',
    version: '1.0',
    owner: 'Platform Engineering',
    maturity: 'Beta' as const,
    layer: 1
  };

  async initialize(): Promise<void> {}

  async execute(context: ExecutionContext): Promise<VerificationResult> {
    const findings = [];
    let status: 'PASS' | 'WARN' | 'FAIL' | 'FATAL' = 'PASS';
    let severity = 0;

    // 1. Lockfiles check
    const hasYarnLock = fs.existsSync(path.join(context.cwd, 'yarn.lock'));
    const hasPackageLock = fs.existsSync(path.join(context.cwd, 'package-lock.json'));

    if (hasYarnLock && hasPackageLock) {
      findings.push({ code: 'REPO001', message: 'Multiple lockfiles detected (yarn.lock and package-lock.json)' });
      status = 'FAIL';
      severity = 8;
    }

    // 2. Scan packages for workspace syntax and scopes
    const packagesDir = path.join(context.cwd, 'packages');
    if (fs.existsSync(packagesDir)) {
      const packages = fs.readdirSync(packagesDir);
      for (const pkg of packages) {
        const pkgJsonPath = path.join(packagesDir, pkg, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
          const content = fs.readFileSync(pkgJsonPath, 'utf8');
          if (content.includes('workspace:*')) {
             findings.push({ code: 'REPO002', message: `workspace:* syntax found in ${pkg}`, file: pkgJsonPath });
             status = 'FAIL';
             severity = 9;
          }
          if (content.includes('@rebuildyourlife/domain-core')) {
             findings.push({ code: 'REPO003', message: `Mismatched scope @rebuildyourlife/domain-core found in ${pkg}`, file: pkgJsonPath });
             status = 'FAIL';
             severity = 9;
          }
        }
      }
    }

    return {
      layerId: this.capability.id,
      status,
      severity,
      confidence: status === 'PASS' ? 100 : (status === 'FAIL' ? 40 : 80),
      durationMs: 50,
      findings,
      recommendations: status === 'FAIL' ? ['Remove redundant lockfiles', 'Align package scopes'] : [],
      evidence: {},
      artifacts: []
    };
  }

  async cleanup(): Promise<void> {}
}
