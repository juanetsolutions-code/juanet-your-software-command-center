import type { AutopilotRule } from "./autopilot-rules-engine";

export class RuleBuilder {
  create(
    tenantId: string,
    name: string,
    trigger: AutopilotRule["trigger"]
  ): AutopilotRule {
    return {
      id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      tenantId,
      name,
      trigger,
      conditions: {},
      actions: [],
      enabled: true,
    };
  }

  addAction(rule: AutopilotRule, action: AutopilotRule["actions"][0]): AutopilotRule {
    rule.actions.push(action);
    return rule;
  }

  setConditions(rule: AutopilotRule, conditions: Record<string, unknown>): AutopilotRule {
    rule.conditions = conditions;
    return rule;
  }
}

export const ruleBuilder = new RuleBuilder();