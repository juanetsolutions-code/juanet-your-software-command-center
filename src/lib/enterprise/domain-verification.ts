/**
 * Domain Verification
 * Allows enterprises to claim and verify their domains.
 */

export interface DomainVerification {
  tenantId: string;
  domain: string;
  status: "pending" | "verified" | "failed";
  verificationToken: string;
  verifiedAt?: string;
}

const verifications = new Map<string, DomainVerification>();

export function initiateDomainVerification(tenantId: string, domain: string): DomainVerification {
  const verification: DomainVerification = {
    tenantId,
    domain,
    status: "pending",
    verificationToken: `juanet-verify-${Math.random().toString(36).slice(2)}`,
  };
  verifications.set(`${tenantId}:${domain}`, verification);
  return verification;
}

export function verifyDomain(tenantId: string, domain: string, token: string): boolean {
  const key = `${tenantId}:${domain}`;
  const record = verifications.get(key);
  if (record && record.verificationToken === token) {
    record.status = "verified";
    record.verifiedAt = new Date().toISOString();
    return true;
  }
  return false;
}
