/**
 * Identity Brokering
 * Acts as broker between internal identity and external IdPs.
 */

export interface BrokeredIdentity {
  internalUserId: string;
  externalId: string;
  provider: string;
  tenantId: string;
}

export class IdentityBrokering {
  broker(tenantId: string, externalId: string, provider: string): BrokeredIdentity {
    return {
      internalUserId: `int-${externalId}`,
      externalId,
      provider,
      tenantId,
    };
  }
}

export const identityBrokering = new IdentityBrokering();
