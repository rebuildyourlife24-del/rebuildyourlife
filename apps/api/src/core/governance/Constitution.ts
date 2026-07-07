export interface GovernanceRuleResult {
  passed: boolean;
  reason?: string;
  requiresHumanReview?: boolean;
}

export interface ProposedAction {
  actionType: string;
  amount?: number;
  currency?: string;
  evidence?: any;
  target?: string;
}

/**
 * The immutable Constitution of the enterprise.
 * These rules cannot be overridden by UI policies or AI reasoning.
 */
export class Constitution {
  
  public evaluate(proposal: ProposedAction): GovernanceRuleResult {
    // Rule 1: EVIDENCE_REQUIRED
    if (!proposal.evidence || Object.keys(proposal.evidence).length === 0) {
      return { 
        passed: false, 
        reason: 'CONSTITUTION_VIOLATION: AI proposals must include evidence.' 
      };
    }

    // Rule 2: NO_DESTRUCTIVE_ACTIONS
    if (proposal.actionType.toUpperCase().includes('DELETE') || proposal.actionType.toUpperCase().includes('DESTROY')) {
      return {
        passed: false,
        reason: 'CONSTITUTION_VIOLATION: Destructive actions are strictly prohibited by the core framework.'
      };
    }

    // Rule 3: BUDGET_LIMIT_SAFEGUARD
    // Threshold set to 250 as requested by the Enterprise Architect.
    if (proposal.amount && proposal.amount > 250) {
      return {
        passed: true, // It passes the constitution, but REQUIRES human review
        requiresHumanReview: true,
        reason: `CONSTITUTION_SAFEGUARD: Financial actions exceeding 250 (requested: ${proposal.amount}) automatically require Human Review.`
      };
    }

    return { passed: true };
  }
}
