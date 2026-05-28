import type { Lead } from "../core/crm-entities";

export type LeadScore = {
  leadId: string;
  score: number;
  tier: "cold" | "warm" | "hot" | "ready";
  factors: Record<string, number>;
};

export class LeadScoringEngine {
  score(lead: Lead): LeadScore {
    let score = lead.score ?? 50;
    const factors: Record<string, number> = {};

    if (lead.lastContactedAt) {
      const hours = Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60));
      factors.recency = Math.max(0, 100 - hours);
      score += factors.recency * 0.3;
    }

    if (lead.tags.includes("api_user")) {
      factors.api_usage = 25;
      score += 25;
    }

    if (lead.tags.includes("pricing_viewed")) {
      factors.pricing_interest = 30;
      score += 30;
    }

    let tier: "cold" | "warm" | "hot" | "ready" = "cold";
    if (score >= 85) tier = "ready";
    else if (score >= 70) tier = "hot";
    else if (score >= 50) tier = "warm";

    return { leadId: lead.id, score: Math.min(Math.round(score), 100), tier, factors };
  }
}