import { AgentCapability, HumanRole } from './roles';

export enum PolicyEffect {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export interface PolicyContext {
  tenantId: string;
  userId?: string;
  userRole?: HumanRole;
  agentId?: string;
  agentCapabilities?: AgentCapability[];
  resource: string; // e.g., "invoice:123"
  action: string;   // e.g., "delete"
}

export interface PolicyStatement {
  effect: PolicyEffect;
  resources: string[]; // support wildcards, e.g. "invoice:*"
  actions: string[];   // support wildcards, e.g. "read:*"
  condition?: (context: PolicyContext) => boolean;
}

export class PolicyEngine {
  private statements: PolicyStatement[] = [];

  public addStatement(statement: PolicyStatement) {
    this.statements.push(statement);
  }

  public evaluate(context: PolicyContext): PolicyEffect {
    // Default Deny
    let finalEffect = PolicyEffect.DENY;

    for (const stmt of this.statements) {
      const resourceMatches = stmt.resources.some(r => r === '*' || r === context.resource || context.resource.startsWith(r.replace('*', '')));
      const actionMatches = stmt.actions.some(a => a === '*' || a === context.action || context.action.startsWith(a.replace('*', '')));
      
      if (resourceMatches && actionMatches) {
        if (!stmt.condition || stmt.condition(context)) {
          finalEffect = stmt.effect;
          // Explicit DENY always overrides ALLOW
          if (finalEffect === PolicyEffect.DENY) {
            return PolicyEffect.DENY;
          }
        }
      }
    }

    return finalEffect;
  }
}
