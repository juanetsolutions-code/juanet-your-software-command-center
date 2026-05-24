import type { EdgeRegion } from "./edge-router";

const affinities = new Map<string, EdgeRegion>();

export function setAffinity(tenantId: string, region: EdgeRegion) {
  affinities.set(tenantId, region);
}

export function getAffinity(tenantId: string): EdgeRegion | null {
  return affinities.get(tenantId) ?? null;
}

export function clearAffinity(tenantId: string) {
  affinities.delete(tenantId);
}
