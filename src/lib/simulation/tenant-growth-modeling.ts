/**
 * Tenant Growth Modeling
 * Models expected tenant acquisition, expansion, and churn for enterprise planning.
 */

export interface TenantGrowthProjection {
  tenantId: string;
  currentMAU: number;
  projectedMAU30d: number;
  projectedMAU90d: number;
  expansionProbability: number;
  churnRisk: number;
}

export class TenantGrowthModeling {
  project(tenantId: string, currentMAU: number, adoptionVelocity: number): TenantGrowthProjection {
    return {
      tenantId,
      currentMAU,
      projectedMAU30d: Math.floor(currentMAU * (1 + adoptionVelocity * 0.6)),
      projectedMAU90d: Math.floor(currentMAU * (1 + adoptionVelocity * 1.8)),
      expansionProbability: Math.min(0.92, 0.4 + adoptionVelocity * 0.5),
      churnRisk: Math.max(0.02, 0.12 - adoptionVelocity * 0.2),
    };
  }
}

export const tenantGrowthModeling = new TenantGrowthModeling();
