import { ValidationResult } from '../validation/validation-result';
import { UniversalIdentity, Agent } from './identity.entity';

export class IdentityRules {
  static validateIdentityForCreation(identity: Partial<UniversalIdentity>): ValidationResult {
    if (!identity.entityType) {
      return ValidationResult.fail('MISSING_ENTITY_TYPE', 'UniversalIdentity must have an entityType.');
    }
    return ValidationResult.success();
  }

  static validateAgentForCreation(agent: Partial<Agent>): ValidationResult {
    if (!agent.name) {
      return ValidationResult.fail('MISSING_AGENT_NAME', 'Agent must have a name.');
    }
    if (!agent.role) {
      return ValidationResult.fail('MISSING_AGENT_ROLE', 'Agent must have a role.');
    }
    return ValidationResult.success();
  }
}
