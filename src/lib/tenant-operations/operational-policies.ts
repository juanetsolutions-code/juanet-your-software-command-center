/**
 * Operational Policies
 * Declarative policies governing tenant operations and automation.
 */

export interface OperationalPolicy {
  id: string;
  tenantId: string;
  name: string;
  rules: string[];
  enabled: boolean;
}

export class OperationalPolicies {
  private policies: OperationalPolicy[] = [];

  define(tenantId: string, name: string, rules: string[]): OperationalPolicy {
    const p: OperationalPolicy = { id: `op-${Date.now()}`, tenantId, name, rules, enabled: true };
    this.policies.push(p);
    return p;
  }
}

export const operationalPolicies = new OperationalPolicies();
