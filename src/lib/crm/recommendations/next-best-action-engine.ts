import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export type Recommendation = {
  type: "call" | "email" | "follow_up" | "discount" | "escalate" | "demo";
  priority: "immediate" | "today" | "this_week" | "later";
  title: string;
  description: string;
  estimatedImpact?: string;
};

export class NextBestActionEngine {
  getForLead(lead: Lead): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    if (lead.status === "new") {
      recommendations.push({
        type: "call",
        priority: "today",
        title: "Initial outreach call",
        description: "Make first contact within 24 hours for highest conversion.",
        estimatedImpact: "Medium",
      });
    }
    
    if (lead.score && lead.score > 80) {
      recommendations.unshift({
        type: "call",
        priority: "immediate",
        title: "Hot lead - immediate follow-up",
        description: "High-scoring lead requires urgent attention.",
        estimatedImpact: "High",
      });
    }
    
    if (lead.lastContactedAt) {
      const days = Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (days > 2) {
        recommendations.push({
          type: "follow_up",
          priority: "today",
          title: "Check-in follow-up",
          description: `${days} days since last contact.`,
          estimatedImpact: "Medium",
        });
      }
    }
    
    return recommendations;
  }

  getForDeal(deal: Deal): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    if (deal.stage === "proposal") {
      recommendations.push({
        type: "follow_up",
        priority: "today",
        title: "Follow up on proposal",
        description: "Proposal sent - check for feedback.",
        estimatedImpact: "High",
      });
    }
    
    if (deal.probability && deal.probability > 75) {
      recommendations.push({
        type: "discount",
        priority: "this_week",
        title: "Prepare closing discount",
        description: "High probability deal - consider incentive.",
        estimatedImpact: "High",
      });
    }
    
    return recommendations;
  }
}

export const nextBestActionEngine = new NextBestActionEngine();