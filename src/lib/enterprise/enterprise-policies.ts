/**
 * Enterprise Policies
 * Custom rules and governance for large tenants.
 */

export interface EnterprisePolicy {
  tenantId: string;
  policyType: "password" | "session" | "data_retention" | "access";
  value: any;
  enforced: boolean;
}

const policies = new Map<string, EnterprisePolicy[]>();

export function setEnterprisePolicy(policy: EnterprisePolicy) {
  const existing = policies.get(policy.tenantId) || [];
  const idx = existing.findIndex((p) => p.policyType === policy.policyType);
  if (idx >= 0) existing[idx] = policy;
  else existing.push(policy);
  policies.set(policy.tenantId, existing);
}

export function getEnterprisePolicies(tenantId: string): EnterprisePolicy[] {
  return policies.get(tenantId) || [];
}
