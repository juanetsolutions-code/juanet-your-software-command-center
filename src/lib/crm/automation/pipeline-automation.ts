import type { Deal } from "../core/crm-entities";
import type { DealStage } from "../core/crm-types";

export type PipelineAutomationRule = {
  id: string;
  tenantId: string;
  name: string;
  trigger: "deal_stalled" | "deal_won" | "deal_lost" | "stage_enter";
  conditions: Record<string, unknown>;
  actions: Array<{
    type: "notify" | "create_task" | "update_probability" | "escalate";
    payload: Record<string, unknown>;
  }>;
};

export class PipelineAutomation {
  private rules: PipelineAutomationRule[] = [];

  register(rule: Omit<PipelineAutomationRule, "id">): PipelineAutomationRule {
    return { ...rule, id: `rule_${Date.now()}` };
  }

  async processDealUpdate(deal: Deal, oldStage?: DealStage): Promise<void> {
    // Check for stale deals
    if (deal.updatedAt && this.isStale(deal)) {
      await this.triggerNotifications(deal, "deal_stalled");
    }
  }

  private isStale(deal: Deal): boolean {
    if (!deal.updatedAt) return false;
    const daysSinceUpdate = (Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 7;
  }

  private async triggerNotifications(deal: Deal, type: "deal_stalled"): Promise<void> {
    console.log(`[PipelineAutomation] Triggering ${type} for deal ${deal.id}`);
  }
}

export const pipelineAutomation = new PipelineAutomation();