/**
 * Tenant Branding
 * Stores branding configuration per tenant for white-label support.
 */

export interface TenantBranding {
  tenantId: string;
  logoUrl?: string;
  primaryColor?: string;
  companyName?: string;
  customDomain?: string;
}

const brandingStore = new Map<string, TenantBranding>();

export function setTenantBranding(tenantId: string, branding: Partial<TenantBranding>) {
  const existing = brandingStore.get(tenantId) || { tenantId };
  brandingStore.set(tenantId, { ...existing, ...branding });
}

export function getTenantBranding(tenantId: string): TenantBranding | undefined {
  return brandingStore.get(tenantId);
}
