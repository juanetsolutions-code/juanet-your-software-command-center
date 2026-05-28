import { leadService } from "./services/lead-service";
import { dealService } from "./services/deal-service";
import { signalEngine } from "./signals/signal-engine";

export type CrmInsight = {
  type: "opportunity" | "risk" | "trend";
  entityType: "lead" | "deal" | "account";
  entityId: string;
  tenantId: string;
  confidence: number;
  insight: string;
  suggestedAction?: string;
};

export class CrmAiInsights {
  async generate(tenantId: string): Promise<CrmInsight[]> {
    const insights: CrmInsight[] = [];
    
    insights.push(...await this.getLeadInsights(tenantId));
    insights.push(...await this.getDealInsights(tenantId));
    
    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  private async getLeadInsights(tenantId: string): Promise<CrmInsight[]> {
    const leads = await leadService.list(tenantId);
    
    return leads
      .filter((lead) => (lead.score ?? 0) >= 70)
      .map((lead) => ({
        type: "opportunity" as const,
        entityType: "lead" as const,
        entityId: lead.id,
        tenantId,
        confidence: 0.85,
        insight: `${lead.firstName} ${lead.lastName} is a hot lead with score ${lead.score}`,
        suggestedAction: "immediate_call",
      }));
  }

  private async getDealInsights(tenantId: string): Promise<CrmInsight[]> {
    const deals = await dealService.list(tenantId);
    
    return deals
      .filter((deal) => {
        if (!deal.updatedAt) return false;
        const days = (Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
        return days > 14 && deal.stage !== "closed_won" && deal.stage !== "closed_lost";
      })
      .map((deal) => ({
        type: "risk" as const,
        entityType: "deal" as const,
        entityId: deal.id,
        tenantId,
        confidence: 0.9,
        insight: `Deal ${deal.name} has been inactive for over 14 days`,
        suggestedAction: "follow_up",
      }));
  }
}