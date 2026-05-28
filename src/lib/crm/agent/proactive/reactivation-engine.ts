import type { Lead } from "../../core/crm-entities";
import type { Deal } from "../../core/crm-entities";
import { taskService } from "../../tasks/task-service";

export class ReactivationEngine {
  async createFlow(lead: Lead): Promise<void> {
    // Create a sequence of re-engagement tasks
    await taskService.create({
      tenantId: lead.tenantId,
      entityType: "lead",
      entityId: lead.id,
      title: "Day 1: Re-engagement email",
      type: "email",
      priority: "medium",
    });
    
    await taskService.create({
      tenantId: lead.tenantId,
      entityType: "lead",
      entityId: lead.id,
      title: "Day 3: Follow-up call",
      type: "call",
      priority: "high",
    });
    
    await taskService.create({
      tenantId: lead.tenantId,
      entityType: "lead",
      entityId: lead.id,
      title: "Day 7: Final outreach",
      type: "email",
      priority: "urgent",
    });
  }
}