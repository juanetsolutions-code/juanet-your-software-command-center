/**
 * Cross-Module Intelligence Layer - Intelligent Alerting
 * Generates smart, low-noise alerts based on cross-module intelligence.
 */

export class IntelligentAlerting {
  generate(tenantId: string, insights: any): any[] {
    return (
      insights.opportunities?.map((opp: string) => ({
        tenantId,
        type: "opportunity",
        message: `Consider ${opp} automation`,
        severity: "info",
      })) || []
    );
  }
}

export const intelligentAlerting = new IntelligentAlerting();
