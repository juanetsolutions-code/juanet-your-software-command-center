/**
 * External Identity Federation Infrastructure - Federation Mapping
 * Handles mapping between external identities and Juanet users/tenants.
 */

export interface IdentityMapping {
  id: string;
  tenantId: string;
  federationId: string;
  externalUserId: string;
  juanetUserId: string;
  attributes: Record<string, any>;
  lastSyncedAt: string;
}

export class FederationMapping {
  private mappings: IdentityMapping[] = [];

  createMapping(mapping: Omit<IdentityMapping, "id" | "lastSyncedAt">): IdentityMapping {
    const m: IdentityMapping = {
      ...mapping,
      id: `map_${Date.now()}`,
      lastSyncedAt: new Date().toISOString(),
    };
    this.mappings.push(m);
    return m;
  }

  getMappingsForFederation(federationId: string, tenantId: string): IdentityMapping[] {
    return this.mappings.filter((m) => m.federationId === federationId && m.tenantId === tenantId);
  }
}

export const federationMapping = new FederationMapping();
