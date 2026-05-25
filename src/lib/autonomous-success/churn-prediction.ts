/**
 * Churn Prediction
 * Predicts tenant churn risk using behavioral and usage signals.
 */

export interface ChurnPrediction {
  tenantId: string;
  churnProbability: number;
  primaryDrivers: string[];
  timeHorizon: string;
  confidence: number;
  interventionSuggestions: string[];
}

export class ChurnPredictor {
  predict(tenantId: string, usage: Record<string, number>, engagement: number): ChurnPrediction {
    const prob = Math.max(
      0.05,
      Math.min(0.9, 0.45 - engagement * 0.6 + (usage.support_tickets || 0) * 0.05),
    );
    return {
      tenantId,
      churnProbability: prob,
      primaryDrivers: prob > 0.4 ? ["declining_logins", "support_friction"] : [],
      timeHorizon: "30-60d",
      confidence: 0.73,
      interventionSuggestions:
        prob > 0.5 ? ["executive_business_review", "onboarding_refresh"] : [],
    };
  }
}

export const churnPrediction = new ChurnPredictor();
