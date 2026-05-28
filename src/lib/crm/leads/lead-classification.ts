import type { Lead } from "../core/crm-entities";

export type LeadClassification = {
  tier: "cold" | "warm" | "hot" | "ready";
  confidence: number;
  reason: string;
};

export class LeadClassifier {
  classify(lead: Lead): LeadClassification {
    const score = lead.score ?? 0;

    if (score >= 85) {
      return { tier: "ready", confidence: 0.95, reason: "high_engagement_score" };
    }

    if (score >= 70) {
      return { tier: "hot", confidence: 0.85, reason: "strong_engagement_signals" };
    }

    if (score >= 50) {
      return { tier: "warm", confidence: 0.70, reason: "moderate_interest" };
    }

    return { tier: "cold", confidence: 0.50, reason: "low_engagement" };
  }
}