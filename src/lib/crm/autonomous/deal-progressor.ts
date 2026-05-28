import { dealService } from "@/lib/crm/services/deal-service";
import { leadService } from "@/lib/crm/services/lead-service";
import { taskService } from "@/lib/crm/tasks/task-service";
import { emitEvent } from "@/lib/event-bus";

export type DealMovement = {
  dealId: string;
  fromStage: string;
  toStage: string;
  reason: string;
};

export class DealProgressor {
  async progressDeals(tenantId: string): Promise<number> {
    const deals = await dealService.list(tenantId);
    let movedCount = 0;

    for (const deal of deals) {
      const movement = await this.evaluateDeal(deal);
      if (movement) {
        await this.moveDeal(deal, movement.toStage, movement.reason);
        movedCount++;
      }
    }

    return movedCount;
  }

  private async evaluateDeal(deal: { id: string; stage: string; value: number; probability: number; tenantId: string; updatedAt?: string }): Promise<DealMovement | null> {
    const daysSinceUpdate = deal.updatedAt 
      ? Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      : 0;

    if (deal.stage === "proposal" && daysSinceUpdate > 7) {
      return {
        dealId: deal.id,
        fromStage: deal.stage,
        toStage: "negotiation",
        reason: "proposal_expired",
      };
    }

    if (deal.probability && deal.probability > 90 && deal.stage === "negotiation") {
      return {
        dealId: deal.id,
        fromStage: deal.stage,
        toStage: "closed_won",
        reason: "high_probability_closed",
      };
    }

    return null;
  }

  private async moveDeal(deal: { id: string; stage: string; tenantId: string }, toStage: string, reason: string): Promise<void> {
    await dealService.update(deal.id, deal.tenantId, { stage: toStage as any });
    
    emitEvent({
      id: `evt_${Date.now()}`,
      type: "deal.autonomous_moved",
      tenantId: deal.tenantId,
      timestamp: new Date().toISOString(),
      payload: { dealId: deal.id, toStage, reason },
      version: "1.0",
    });
  }
}