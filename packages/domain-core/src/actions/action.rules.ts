import { ValidationResult } from '../validation/validation-result';
import { Action } from './action.entity';

export class ActionRules {
  static validateActionForCreation(action: Partial<Action>): ValidationResult {
    if (!action.decisionId) {
      return ValidationResult.fail(
        'ABEE_ACTION_REQUIRES_DECISION',
        'Elke Action vereist een gekoppelde Decision in de ABEE architectuur.'
      );
    }
    if (!action.identityId) {
      return ValidationResult.fail(
        'ABEE_ACTION_REQUIRES_IDENTITY',
        'Action must be linked to an Identity.'
      );
    }
    return ValidationResult.success();
  }
}
