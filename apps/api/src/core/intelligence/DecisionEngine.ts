import { DigitalTwin } from '../twin/DigitalTwin.js';
import { IReasoningProvider } from '../sdk/IReasoningProvider.js';
import { GovernancePlane } from '../governance/GovernancePlane.js';

export class DecisionEngine {
  private twin: DigitalTwin;
  private reasoningProvider: IReasoningProvider;
  private governance: GovernancePlane;

  constructor(reasoningProvider: IReasoningProvider) {
    this.twin = DigitalTwin.getInstance();
    this.reasoningProvider = reasoningProvider;
    this.governance = new GovernancePlane();
  }

  /**
   * The core cognitive loop.
   * 1. Observe (Read Twin)
   * 2. Orient/Decide (AI Reasoning)
   * 3. Act (Propose to Governance)
   */
  public async runCognitiveCycle(): Promise<any> {
    console.log('[DecisionEngine] Waking up. Starting Cognitive Cycle...');
    
    // 1. Observe
    const currentState = this.twin.getStateSnapshot();
    console.log(`[DecisionEngine] Current Revenue: ${currentState.currentRevenue}, Orders: ${currentState.totalOrders}`);

    // 2. Orient & Decide
    const proposal = await this.reasoningProvider.analyzeAndPropose(currentState);
    
    if (!proposal) {
      console.log('[DecisionEngine] AI decided no action is necessary at this time.');
      return { status: 'IDLE', reason: 'No action proposed by AI.' };
    }

    console.log(`[DecisionEngine] AI Proposed Action: ${proposal.actionType}`);

    // 3. Act (Send to Governance)
    // We do NOT execute it directly. We ask permission.
    const decision = await this.governance.evaluateProposal(proposal);
    
    return {
      status: 'CYCLE_COMPLETE',
      proposal,
      governanceDecision: decision
    };
  }
}
