import { ValidationResult } from './validation-result';

export class InvariantEngine {
  
  /**
   * Action Domain
   */
  public validateAction(action: any): ValidationResult {
    if (!action.decisionId) {
      return ValidationResult.fail(
        'ABEE_ACTION_REQUIRES_DECISION',
        'Elke Action vereist een gekoppelde Decision in de ABEE architectuur.'
      );
    }
    return ValidationResult.success();
  }

  /**
   * Decision Domain
   */
  public validateDecision(decision: any): ValidationResult {
    if (!decision.goalId) {
      return ValidationResult.fail(
        'ABEE_DECISION_REQUIRES_GOAL',
        'Elke Decision vereist een gekoppelde Goal in de ABEE architectuur.'
      );
    }
    return ValidationResult.success();
  }

  /**
   * Outcome Domain
   */
  public validateOutcome(outcome: any): ValidationResult {
    if (!outcome.actionId) {
      return ValidationResult.fail(
        'ABEE_OUTCOME_REQUIRES_ACTION',
        'Elke Outcome vereist een gekoppelde Action in de ABEE architectuur.'
      );
    }
    return ValidationResult.success();
  }

  /**
   * Memory Domain
   */
  public validateMemory(memory: any, sourceId?: string): ValidationResult {
    if (!memory.identityId) {
      return ValidationResult.fail(
        'ABEE_MEMORY_REQUIRES_IDENTITY',
        'Elke Memory vereist een gekoppelde Identity in de ABEE architectuur.'
      );
    }
    if (!sourceId) {
      return ValidationResult.fail(
        'ABEE_MEMORY_REQUIRES_SOURCE',
        'Elke Memory vereist een originele Source referentie.'
      );
    }
    return ValidationResult.success();
  }

  /**
   * Identity Domain
   */
  public validateIdentity(identity: any): ValidationResult {
    if (!identity.entityType) {
      return ValidationResult.fail(
        'ABEE_IDENTITY_REQUIRES_TYPE',
        'Elke UniversalIdentity vereist een entityType (USER, AGENT, SYSTEM).'
      );
    }
    return ValidationResult.success();
  }
}
