/**
 * Region Routing
 * Prepares routing of tenants to optimal regions.
 */

export type Region = "us-east" | "eu-central" | "ap-southeast";

const tenantRegions = new Map<string, Region>();

export function assignTenantRegion(tenantId: string, region: Region) {
  tenantRegions.set(tenantId, region);
}

export function getTenantRegion(tenantId: string): Region | undefined {
  return tenantRegions.get(tenantId);
}
