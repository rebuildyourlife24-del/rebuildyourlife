import { PrismaClient } from '@prisma/client';
import { Constitution, ProposedAction, GovernanceRuleResult } from './Constitution';

export interface GovernanceDecision {
  decision: 'APPROVE' | 'BLOCK' | 'HUMAN_REVIEW';
  reason: string;
  ledgerId?: string;
}

export class GovernancePlane {
  private constitution: Constitution;
  private prisma: PrismaClient;

  constructor() {
    this.constitution = new Constitution();
    this.prisma = new PrismaClient();
  }

  /**
   * The ultimate firewall. Evaluates a proposal against the Constitution and Policies.
   */
  public async evaluateProposal(proposal: ProposedAction, contextEventId?: string): Promise<GovernanceDecision> {
    
    // 1. Check Hardcoded Constitution
    const constitutionResult = this.constitution.evaluate(proposal);
    
    let finalDecision: 'APPROVE' | 'BLOCK' | 'HUMAN_REVIEW' = 'APPROVE';
    let finalReason = 'Action complies with all governance rules.';

    if (!constitutionResult.passed) {
      finalDecision = 'BLOCK';
      finalReason = constitutionResult.reason || 'Blocked by Constitution.';
    } else if (constitutionResult.requiresHumanReview) {
      finalDecision = 'HUMAN_REVIEW';
      finalReason = constitutionResult.reason || 'Human review required by Constitution.';
    }

    // 2. Check Database Policies (if it passed the constitution)
    if (finalDecision === 'APPROVE') {
      // Future: Query ExecutiveIntent or GovernancePolicy from Prisma
      // e.g. "Is it Black Friday mode?" or "Max daily ad spend exceeded?"
      // For V6.0 Foundation, we rely on the Constitution first.
    }

    // 3. Write to Decision Ledger (100% Auditability)
    const ledgerEntry = await this.prisma.decisionLedger.create({
      data: {
        contextEventId: contextEventId || null,
        proposal: JSON.stringify(proposal),
        evidence: proposal.evidence || {},
        decision: finalDecision,
        reason: finalReason, // Note: We might want to add reason to the schema later, or store it in outcomeObserved
        executed: false
      }
    });

    console.log(`[GovernancePlane] Decision: ${finalDecision} | Ledger ID: ${ledgerEntry.id}`);

    return {
      decision: finalDecision,
      reason: finalReason,
      ledgerId: ledgerEntry.id
    };
  }
}
