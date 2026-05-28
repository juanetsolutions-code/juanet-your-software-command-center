import { leadService } from "@/lib/crm/services/lead-service";
import { dealService } from "@/lib/crm/services/deal-service";
import { LeadPriorityEngine } from "@/lib/crm/leads/lead-priority-engine";
import { DealScoreModelEngine } from "@/lib/crm/analytics/deal-score-model";

export type NextBestAction = {
  leadId?: string;
  dealId?: string;
  action: string;
  priority: number;
  reason: string;
};

export class NextBestActionEngine {
  private priorityEngine = new LeadPriorityEngine();
  private dealScorer = new DealScoreModelEngine();

  async getNextActions(tenantId: string): Promise<NextBestAction[]> {
    const leads = await leadService.list(tenantId);
    const deals = await dealService.list(tenantId);

    const actions: NextBestAction[] = [];

    const hotLeads = this.priorityEngine.getTopLeads(leads, 3);
    for (const lead of hotLeads) {
      actions.push({
        leadId: lead.leadId,
        action: lead.nextAction,
        priority: lead.priority,
        reason: "Hot lead requiring immediate attention",
      });
    }

    const urgentDeals = deals
      .filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost")
      .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))
      .slice(0, 2);

    for (const deal of urgentDeals) {
      const score = this.dealScorer.score(deal);
      actions.push({
        dealId: deal.id,
        action: score.probability > 80 ? "schedule_closing" : "follow_up",
        priority: score.probability,
        reason: `Deal probability: ${score.probability}%`,
      });
    }

    return actions.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }
}