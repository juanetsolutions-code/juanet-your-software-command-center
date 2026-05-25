/**
 * External Identity Federation Infrastructure - Federation Policies
 * Defines policies governing how federation is allowed and what attributes can be synced.
 */

export interface FederationPolicy {
  id: string;
  tenantId: string;
  provider: string;
  allowedAttributes: string[];
  autoLinkUsers: boolean;
  requireApproval: boolean;
  maxUsers?: number;
}

export class FederationPolicies {
  private policies: FederationPolicy[] = [];

  createPolicy(policy: Omit<FederationPolicy, "id">): FederationPolicy {
    const p: FederationPolicy = {
      ...policy,
      id: `policy_${Date.now()}`,
    };
    this.policies.push(p);
    return p;
  }

  getPoliciesForTenant(tenantId: string): FederationPolicy[] {
    return this.policies.filter((p) => p.tenantId === tenantId);
  }
}

export const federationPolicies = new FederationPolicies();
