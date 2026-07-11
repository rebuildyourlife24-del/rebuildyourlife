import { ValidationResult } from '../validation/validation-result';
import { Decision } from './decision.entity';

export class DecisionRules {
  static validateDecisionForCreation(decision: Partial<Decision>): ValidationResult {
    if (!decision.goalId) {
      return ValidationResult.fail(
        'ABEE_DECISION_REQUIRES_GOAL',
        'Elke Decision vereist een gekoppelde Goal in de ABEE architectuur.'
      );
    }
    if (!decision.identityId) {
      return ValidationResult.fail(
        'ABEE_DECISION_REQUIRES_IDENTITY',
        'Decision must be linked to an Identity.'
      );
    }
    return ValidationResult.success();
  }
}
