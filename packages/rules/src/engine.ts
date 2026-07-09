export interface RuleCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  value: any;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  conditions: RuleCondition[];
  action: 'ALLOW' | 'DENY' | 'ESCALATE' | 'TRIGGER_WORKFLOW';
  metadata?: Record<string, any>;
}

export class RulesEngine {
  public evaluate(facts: Record<string, any>, rules: Rule[]): Rule[] {
    const triggeredRules: Rule[] = [];

    for (const rule of rules) {
      if (this.evaluateConditions(facts, rule.conditions)) {
        triggeredRules.push(rule);
      }
    }

    return triggeredRules;
  }

  private evaluateConditions(facts: Record<string, any>, conditions: RuleCondition[]): boolean {
    if (conditions.length === 0) return true; // No conditions = always matches

    // Default to AND logic for all conditions in a single rule
    for (const condition of conditions) {
      const factValue = facts[condition.field];

      if (factValue === undefined) return false;

      switch (condition.operator) {
        case 'EQUALS':
          if (factValue !== condition.value) return false;
          break;
        case 'NOT_EQUALS':
          if (factValue === condition.value) return false;
          break;
        case 'GREATER_THAN':
          if (factValue <= condition.value) return false;
          break;
        case 'LESS_THAN':
          if (factValue >= condition.value) return false;
          break;
        case 'CONTAINS':
          if (!String(factValue).includes(String(condition.value))) return false;
          break;
        default:
          return false;
      }
    }
    return true;
  }
}
