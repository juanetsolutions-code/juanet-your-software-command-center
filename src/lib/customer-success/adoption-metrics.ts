/**
 * Adoption Metrics
 * Tracks feature adoption per tenant.
 */

const adoptionData = new Map<string, Record<string, number>>();

export function recordFeatureAdoption(tenantId: string, feature: string, count = 1) {
  const data = adoptionData.get(tenantId) || {};
  data[feature] = (data[feature] || 0) + count;
  adoptionData.set(tenantId, data);
}

export function getAdoptionMetrics(tenantId: string) {
  return adoptionData.get(tenantId) || {};
}
