/**
 * Business Impact Observability
 * Links technical metrics to business outcomes.
 */

export interface BusinessImpact {
  metric: string;
  technicalValue: number;
  businessImpact: string;
  severity: "low" | "medium" | "high";
}

export class BusinessImpactObservability {
  map(technical: Record<string, number>): BusinessImpact[] {
    return Object.entries(technical).map(([k, v]) => ({
      metric: k,
      technicalValue: v,
      businessImpact: v > 0.8 ? "revenue_at_risk" : "normal",
      severity: v > 0.8 ? "high" : "low",
    }));
  }
}

export const businessImpactObservability = new BusinessImpactObservability();
