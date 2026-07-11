export interface Finding {
  code: string;
  message: string;
  file?: string;
  line?: number;
}

export interface VerificationResult {
  layerId: string;
  status: 'PASS' | 'WARN' | 'FAIL' | 'FATAL';
  severity: number; // 0-10, 10 being critical block
  confidence: number; // 0-100%
  durationMs: number;
  findings: Finding[];
  recommendations: string[];
  evidence: any;
  artifacts: string[];
}

export interface ScanManifest {
  id: string;
  timestamp: string;
  git_commit: string;
  git_branch: string;
  node_version: string;
  workspace: string;
}

export interface ExecutionContext {
  cwd: string;
  env: Record<string, string | undefined>;
  historicalDataPath: string;
  manifest: ScanManifest;
  config: DIVPConfig;
}

export interface Capability {
  id: string;
  version: string;
  owner: string;
  maturity: 'Prototype' | 'Beta' | 'Production' | 'Enterprise' | 'Autonomous';
  layer: number;
}

export interface IVerificationLayer {
  capability: Capability;
  initialize(): Promise<void>;
  execute(context: ExecutionContext): Promise<VerificationResult>;
  cleanup(): Promise<void>;
}

export interface AIDiagnosis {
  rootCause: string;
  suggestedFix: string;
  confidence: number;
  historicalMatches: string[];
}

export interface AIProvider {
  name: string;
  analyzeError(errorLog: string, context: any): Promise<AIDiagnosis>;
}

// Future expansion: Config and EventBus
export interface DIVPConfig {
  historyEnabled: boolean;
  minConfidence: number;
  weights: Record<string, number>;
}
