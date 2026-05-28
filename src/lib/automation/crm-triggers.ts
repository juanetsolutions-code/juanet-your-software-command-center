import type { Deal } from "@/lib/crm/core/crm-entities";
import type { Lead } from "@/lib/crm/core/crm-entities";
import { CrmActions } from "./crm-actions";
import { CrmTriggerEngine } from "@/lib/crm/events/crm-trigger-engine";

export class CrmTriggers {
  private actions = new CrmActions();
  private triggerEngine = new CrmTriggerEngine();

  async evaluateLead(lead: Lead): Promise<void> {
    const events = this.triggerEngine.evaluateLead(lead);

    for (const event of events) {
      if (event.type === "lead_hot") {
        await this.actions.createTaskForLead(lead, "Hot lead - immediate outreach", "urgent");
      }
    }
  }

  async evaluateDeal(deal: Deal): Promise<void> {
    const events = this.triggerEngine.evaluateDeal(deal);

    for (const event of events) {
      if (event.type === "deal_stalled") {
        await this.actions.createTaskForDeal(deal, "Follow up on stalled deal", "high");
      }
    }
  }
}