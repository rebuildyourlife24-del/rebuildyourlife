import { ValidationResult } from '../validation/validation-result';
import { Outcome } from './outcome.entity';

export class OutcomeRules {
  static validateOutcomeForCreation(outcome: Partial<Outcome>): ValidationResult {
    if (!outcome.actionId) {
      return ValidationResult.fail(
        'ABEE_OUTCOME_REQUIRES_ACTION',
        'Elke Outcome vereist een gekoppelde Action in de ABEE architectuur.'
      );
    }
    return ValidationResult.success();
  }
}
