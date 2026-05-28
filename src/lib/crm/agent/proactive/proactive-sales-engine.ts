import type { Lead } from "../../core/crm-entities";
import type { Deal } from "../../core/crm-entities";
import { taskService, type CrmTask } from "../../tasks/task-service";

export class ProactiveSalesEngine {
  async reengage(lead: Lead): Promise<boolean> {
    if (lead.status === "new" && lead.score && lead.score < 50) {
      await taskService.create({
        tenantId: lead.tenantId,
        entityType: "lead",
        entityId: lead.id,
        title: "Re-engagement follow-up",
        type: "email",
        priority: "medium",
      });
      return true;
    }
    return false;
  }

  async nudgedeal(deal: Deal): Promise<boolean> {
    if (!deal.updatedAt) return false;
    
    const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days > 7 && deal.stage !== "closed_won" && deal.stage !== "closed_lost") {
      await taskService.create({
        tenantId: deal.tenantId,
        entityType: "deal",
        entityId: deal.id,
        title: "Deal inactivity check",
        type: "call",
        priority: "high",
      });
      return true;
    }
    return false;
  }
}