/**
 * Rule Engine
 * IF / THEN rule system for automations.
 * Safe evaluation without eval().
 */

import type { Rule, RuleEvaluationResult, RuleCondition } from './rule-types';

export class RuleEngine {
  private rules: Rule[] = [];

  registerRule(rule: Rule) {
    this.rules.push(rule);
  }

  evaluate(payload: any, context: any): RuleEvaluationResult[] {
    return this.rules
      .filter(rule => this.matchesCondition(rule.condition, payload, context))
      .map(rule => ({
        ruleId: rule.id,
        matched: true,
        actions: rule.actions,
      }));
  }

  private matchesCondition(condition: RuleCondition, payload: any, context: any): boolean {
    const value = payload[condition.field] ?? context[condition.field];
    switch (condition.operator) {
      case 'eq': return value === condition.value;
      case 'gt': return Number(value) > Number(condition.value);
      case 'contains': return String(value).includes(String(condition.value));
      default: return false;
    }
  }
}

export const ruleEngine = new RuleEngine();
