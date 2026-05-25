/**
 * Predictive Alerting
 * Generates forward-looking alerts based on trends and risk models.
 * Prepares alerts before issues become critical.
 */

import type { OperationalRisk } from "./operational-intelligence";

export interface PredictiveAlert {
  id: string;
  tenantId: string;
  riskCategory: string;
  predictedTimeToImpact: string; // e.g. "18m"
  probability: number;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  suggestedPreemptiveActions: string[];
  timestamp: string;
}

export class PredictiveAlerting {
  generateAlerts(risks: OperationalRisk[]): PredictiveAlert[] {
    return risks
      .filter((r) => r.score > 0.4)
      .map((risk) => {
        const probability = Math.min(0.95, risk.score * risk.confidence);
        const severity = risk.score > 0.8 ? "critical" : risk.score > 0.6 ? "high" : "medium";

        return {
          id: `pred-${risk.id}`,
          tenantId: risk.tenantId,
          riskCategory: risk.category,
          predictedTimeToImpact: risk.score > 0.75 ? "8-15m" : "25-40m",
          probability,
          severity,
          message: `Predicted ${risk.category} issue: ${risk.description}`,
          suggestedPreemptiveActions: risk.recommendedRemediation.split(";").map((s) => s.trim()),
          timestamp: new Date().toISOString(),
        };
      });
  }
}

export const predictiveAlerting = new PredictiveAlerting();
