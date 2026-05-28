import { followupEngine } from "../tasks/followup-engine";
import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export type FollowupAutomationRule = {
  id: string;
  tenantId: string;
  name: string;
  trigger: "lead_created" | "lead_qualified" | "deal_created" | "no_contact_days";
  delayHours: number;
  action: "create_task" | "send_reminder" | "notify_owner";
};

export class FollowupAutomation {
  private rules: FollowupAutomationRule[] = [
    {
      id: "default_24h_followup",
      tenantId: "default",
      name: "24-hour lead follow-up",
      trigger: "lead_created",
      delayHours: 24,
      action: "create_task",
    },
  ];

  async scheduleLeadFollowup(lead: Lead): Promise<void> {
    const rule = this.rules.find((r) => r.trigger === "lead_created");
    if (rule) {
      await followupEngine.createFollowup(lead.tenantId, "lead", lead.id, lead.assignedTo);
    }
  }

  async scheduleDealCheckin(deal: Deal): Promise<void> {
    const rule = this.rules.find((r) => r.trigger === "deal_created");
    if (rule) {
      await followupEngine.createFollowup(deal.tenantId, "deal", deal.id, deal.assignedTo);
    }
  }
}

export const followupAutomation = new FollowupAutomation();