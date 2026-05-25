/**
 * Normalization Layer
 * Standardizes data formats across sources for downstream consumption.
 */

export interface NormalizedRecord {
  id: string;
  tenantId: string;
  entityType: string;
  normalizedData: Record<string, any>;
  sourceSchema: string;
}

export class NormalizationLayer {
  normalize(payload: any, tenantId: string, entityType: string): NormalizedRecord {
    return {
      id: `norm-${Date.now()}`,
      tenantId,
      entityType,
      normalizedData: { ...payload, _normalized: true },
      sourceSchema: "v1",
    };
  }
}

export const normalizationLayer = new NormalizationLayer();
