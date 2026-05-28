import type { Lead } from "@/lib/crm/core/crm-entities";
import type { Deal } from "@/lib/crm/core/crm-entities";

export type PriorityScore = {
  entityId: string;
  score: number;
  factors: Record<string, number>;
};

export class PriorityScorer {
  scoreLead(lead: Lead): PriorityScore {
    let score = lead.score ?? 50;
    const factors: Record<string, number> = {};

    if (lead.score) {
      factors.leadScore = lead.score;
    }

    if (lead.lastContactedAt) {
      const hours = Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60));
      factors.recency = Math.max(0, 100 - hours);
      score += factors.recency * 0.3;
    } else {
      factors.uncontacted = 50;
      score += 25;
    }

    if (lead.tags.includes("api_user")) {
      factors.apiUser = 30;
      score += 30;
    }

    return {
      entityId: lead.id,
      score: Math.min(Math.round(score), 100),
      factors,
    };
  }

  scoreDeal(deal: Deal): PriorityScore {
    let score = deal.probability ?? 50;
    const factors: Record<string, number> = {};

    factors.value = Math.min(deal.value / 1000, 50);
    score += factors.value;

    if (deal.updatedAt) {
      const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      factors.staleness = days > 7 ? 40 : days > 3 ? 20 : 0;
      score += factors.staleness;
    }

    factors.priority = deal.priority === "urgent" ? 30 : deal.priority === "high" ? 20 : 10;
    score += factors.priority;

    return {
      entityId: deal.id,
      score: Math.min(Math.round(score), 100),
      factors,
    };
  }
}