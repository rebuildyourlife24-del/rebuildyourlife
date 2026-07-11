import { ValidationResult } from '../validation/validation-result';
import { MemoryFoundation } from './memory.entity';

export class MemoryRules {
  static validateMemoryForCreation(memory: Partial<MemoryFoundation>, sourceId?: string): ValidationResult {
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

  static validateKnowledgePromotion(confidence: number, threshold: number = 0.8): ValidationResult {
    if (confidence < threshold) {
      return ValidationResult.fail(
        'ABEE_KNOWLEDGE_CONFIDENCE_LOW',
        `Knowledge vertrouwen (${confidence}) is lager dan de threshold (${threshold}). Promotie geweigerd.`
      );
    }
    return ValidationResult.success();
  }
}
