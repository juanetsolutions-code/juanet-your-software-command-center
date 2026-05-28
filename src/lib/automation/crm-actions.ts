import type { Lead } from "@/lib/crm/core/crm-entities";
import type { Deal } from "@/lib/crm/core/crm-entities";
import { leadService } from "@/lib/crm/services/lead-service";
import { dealService } from "@/lib/crm/services/deal-service";
import { taskService } from "@/lib/crm/tasks/task-service";
import { salesAgent } from "@/lib/crm/agent/sales-agent-orchestrator";
import { emitEvent } from "@/lib/event-bus";

export class CrmActions {
  async createTaskForLead(lead: Lead, title: string, priority: "low" | "medium" | "high" | "urgent" = "medium"): Promise<string> {
    const task = await taskService.create({
      tenantId: lead.tenantId,
      entityType: "lead",
      entityId: lead.id,
      title,
      type: "call",
      priority,
    });

    emitEvent({
      id: `evt_${Date.now()}`,
      type: "crm.task.automated",
      tenantId: lead.tenantId,
      timestamp: new Date().toISOString(),
      payload: { taskId: task.id, leadId: lead.id, type: "lead_task" },
      version: "1.0",
    });

    return task.id;
  }

  async createTaskForDeal(deal: Deal, title: string, priority: "low" | "medium" | "high" | "urgent" = "high"): Promise<string> {
    const task = await taskService.create({
      tenantId: deal.tenantId,
      entityType: "deal",
      entityId: deal.id,
      title,
      type: "call",
      priority,
    });

    return task.id;
  }

  async updateLeadScore(leadId: string, tenantId: string, score: number): Promise<void> {
    await leadService.update(leadId, tenantId, { score });
  }

  async advanceDeal(dealId: string, tenantId: string, stage: string): Promise<void> {
    await dealService.update(dealId, tenantId, { stage: stage as any });
  }
}