/**
 * Growth Opportunities
 * Identifies expansion and upsell signals within tenant data.
 */

export interface GrowthOpportunity {
  tenantId: string;
  type: "feature_adoption" | "seat_expansion" | "tier_upgrade" | "new_module";
  potentialValue: number;
  confidence: number;
  signals: string[];
  recommendedPlay: string;
}

export class GrowthOpportunities {
  detect(tenantId: string, usage: Record<string, any>): GrowthOpportunity[] {
    const opps: GrowthOpportunity[] = [];
    if (usage.activeUsers > usage.licensedSeats * 0.85) {
      opps.push({
        tenantId,
        type: "seat_expansion",
        potentialValue: 2400,
        confidence: 0.8,
        signals: ["high_seat_utilization"],
        recommendedPlay: "seats_upsell_campaign",
      });
    }
    return opps;
  }
}

export const growthOpportunities = new GrowthOpportunities();
