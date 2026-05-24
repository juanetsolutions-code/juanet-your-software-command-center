/**
 * Rule Evaluator - Safe condition evaluation.
 */

import type { RuleCondition } from './rule-types';

export function evaluateCondition(condition: RuleCondition, payload: any, context: any): boolean {
  const value = payload[condition.field] ?? context[condition.field];
  switch (condition.operator) {
    case 'eq': return value === condition.value;
    case 'gt': return Number(value) > Number(condition.value);
    case 'contains': return String(value).includes(String(condition.value));
    default: return false;
  }
}
