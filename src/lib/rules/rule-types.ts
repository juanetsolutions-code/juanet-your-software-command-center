/**
 * Rule Types
 */

export interface RuleCondition {
  field: string;
  operator: 'eq' | 'gt' | 'contains';
  value: any;
}

export interface Rule {
  id: string;
  tenantId?: string;
  name: string;
  condition: RuleCondition;
  actions: Array<{ type: string; config: any }>;
}

export interface RuleEvaluationResult {
  ruleId: string;
  matched: boolean;
  actions?: any[];
}
