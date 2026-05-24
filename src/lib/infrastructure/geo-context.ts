/**
 * Geo Context
 */

export interface GeoContext {
  tenantId: string;
  country?: string;
  region?: string;
}

const geoData = new Map<string, GeoContext>();

export function setGeoContext(tenantId: string, context: GeoContext) {
  geoData.set(tenantId, context);
}

export function getGeoContext(tenantId: string): GeoContext | undefined {
  return geoData.get(tenantId);
}
