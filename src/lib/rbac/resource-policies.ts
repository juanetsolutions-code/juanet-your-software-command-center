/**
 * Resource Policies
 * Defines fine-grained resource-level authorization policies.
 */

export interface ResourcePolicy {
  resource: string;
  actions: string[];
  requiredLevel: number;
  conditions?: Record<string, any>;
}

export const defaultResourcePolicies: ResourcePolicy[] = [
  { resource: "tenant.settings", actions: ["read", "write"], requiredLevel: 70 },
  { resource: "billing.invoices", actions: ["read"], requiredLevel: 40 },
  { resource: "workflows.execute", actions: ["write"], requiredLevel: 40 },
  { resource: "users.manage", actions: ["read", "write", "delete"], requiredLevel: 70 },
];

export class ResourcePolicies {
  getPolicyFor(resource: string): ResourcePolicy | undefined {
    return defaultResourcePolicies.find((p) => p.resource === resource);
  }

  isActionAllowed(policy: ResourcePolicy, action: string, userLevel: number): boolean {
    return policy.actions.includes(action) && userLevel >= policy.requiredLevel;
  }
}

export const resourcePolicies = new ResourcePolicies();
