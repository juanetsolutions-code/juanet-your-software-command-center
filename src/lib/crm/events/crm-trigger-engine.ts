import type { Deal } from "../core/crm-entities";
import type { Lead } from "../core/crm-entities";

export type CrmTriggerEvent = {
  type: "deal_stalled" | "lead_hot" | "deal_closed" | "pipeline_milestone";
  entityId: string;
  entityType: "deal" | "lead";
  tenantId: string;
  priority: "low" | "medium" | "high" | "urgent";
};

export class CrmTriggerEngine {
  evaluateDeal(deal: Deal): CrmTriggerEvent[] {
    const events: CrmTriggerEvent[] = [];

    if (!deal.updatedAt) return events;

    const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));

    if (days > 14 && deal.stage !== "closed_won" && deal.stage !== "closed_lost") {
      events.push({
        type: "deal_stalled",
        entityId: deal.id,
        entityType: "deal",
        tenantId: deal.tenantId,
        priority: "high",
      });
    }

    return events;
  }

  evaluateLead(lead: Lead): CrmTriggerEvent[] {
    const events: CrmTriggerEvent[] = [];

    if ((lead.score ?? 0) >= 80) {
      events.push({
        type: "lead_hot",
        entityId: lead.id,
        entityType: "lead",
        tenantId: lead.tenantId,
        priority: "urgent",
      });
    }

    return events;
  }
}