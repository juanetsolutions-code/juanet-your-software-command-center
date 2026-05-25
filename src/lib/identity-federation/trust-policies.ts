/**
 * Trust Policies
 * Defines and enforces trust relationships between organizations and IdPs.
 */

export interface TrustPolicy {
  id: string;
  tenantId: string;
  trustedOrg: string;
  trustLevel: "full" | "limited" | "none";
}

export class TrustPolicies {
  private policies: TrustPolicy[] = [];

  define(tenantId: string, trustedOrg: string, level: TrustPolicy["trustLevel"]): TrustPolicy {
    const p: TrustPolicy = { id: `trust-${Date.now()}`, tenantId, trustedOrg, trustLevel: level };
    this.policies.push(p);
    return p;
  }
}

export const trustPolicies = new TrustPolicies();
