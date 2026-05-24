export interface GovernancePolicy {
  id: string;
  tenantId: string;
  description: string;
  rules: Array<{ field: string; rule: string }>;
}

const policies = new Map<string, GovernancePolicy>();

export function setGovernancePolicy(p: GovernancePolicy) {
  policies.set(p.id, p);
}

export function listGovernancePolicies(tenantId: string): GovernancePolicy[] {
  return Array.from(policies.values()).filter((p) => p.tenantId === tenantId);
}
