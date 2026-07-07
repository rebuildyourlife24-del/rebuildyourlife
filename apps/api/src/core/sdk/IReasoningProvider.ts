import { EnterpriseStateSummary } from '../twin/DigitalTwin';
import { ProposedAction } from '../governance/Constitution';

export interface IReasoningProvider {
  /**
   * Identifies the AI model provider (e.g. OPENAI_GPT4)
   */
  readonly name: string;

  /**
   * Analyzes the current state of the enterprise and proposes an action.
   */
  analyzeAndPropose(state: EnterpriseStateSummary): Promise<ProposedAction | null>;
}
