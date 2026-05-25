/**
 * Adoption Optimization
 * Prepares strategies to accelerate feature and platform adoption per tenant.
 */

export interface AdoptionRecommendation {
  tenantId: string;
  feature: string;
  currentAdoption: number;
  targetAdoption: number;
  strategy: string;
  expectedLift: number;
}

export class AdoptionOptimization {
  recommend(tenantId: string, adoption: Record<string, number>): AdoptionRecommendation[] {
    return Object.entries(adoption).map(([feat, pct]) => ({
      tenantId,
      feature: feat,
      currentAdoption: pct,
      targetAdoption: 0.75,
      strategy: pct < 0.3 ? "guided_onboarding" : "advanced_training",
      expectedLift: 0.22,
    }));
  }
}

export const adoptionOptimization = new AdoptionOptimization();
