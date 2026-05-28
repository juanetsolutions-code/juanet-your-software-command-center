import { registerEventHandler, emitEvent, type DomainEvent } from "@/lib/event-bus";
import { dealService } from "../services/deal-service";
import { leadService } from "../services/lead-service";
import { salesAgent } from "../agent/sales-agent-orchestrator";

export class CrmEventBus {
  initialize(): void {
    this.registerDealEvents();
    this.registerLeadEvents();
  }

  private registerDealEvents(): void {
    registerEventHandler({
      id: "crm-deal-updated",
      eventType: "deal.updated",
      handler: async (event: DomainEvent) => {
        const { tenantId, dealId } = event.payload as { tenantId: string; dealId: string };
        if (!tenantId || !dealId) return;

        const deal = await dealService.getById(dealId, tenantId);
        if (!deal) return;

        const level = salesAgent.getAutonomyLevel(tenantId);
        if (level === "off") return;

        const decisions = await salesAgent.evaluate({ 
          tenantId, 
          signals: [{
            id: `sig_${Date.now()}`,
            type: "deal_stuck",
            entityType: "deal",
            entityId: dealId,
            severity: "info",
            message: "Deal updated - checking progression",
            detectedAt: new Date().toISOString(),
          }] 
        });

        if (decisions.length > 0) {
          const { actionRouter } = await import("../agent/actions/action-router");
          for (const decision of decisions) {
            if (!decision.action.requiresApproval) {
              await actionRouter.route(decision, { tenantId });
            }
          }
        }
      },
      priority: 5,
      tenantScoped: true,
    });
  }

  private registerLeadEvents(): void {
    registerEventHandler({
      id: "crm-lead-created",
      eventType: "lead.created",
      handler: async (event: DomainEvent) => {
        const { tenantId, leadId } = event.payload as { tenantId: string; leadId: string };
        if (!tenantId || !leadId) return;

        const lead = await leadService.getById(leadId, tenantId);
        if (!lead) return;

        salesAgent.evaluate({ 
          tenantId, 
          signals: [{
            id: `sig_${Date.now()}`,
            type: "high_intent",
            entityType: "lead",
            entityId: leadId,
            severity: "info",
            message: "New lead detected",
            detectedAt: new Date().toISOString(),
          }] 
        }).catch(console.error);
      },
      priority: 5,
      tenantScoped: true,
    });
  }

  emit(type: string, payload: Record<string, unknown>, tenantId?: string): void {
    emitEvent({
      id: `evt_${Date.now()}`,
      type: `crm.${type}`,
      tenantId,
      timestamp: new Date().toISOString(),
      payload,
      version: "1.0",
    });
  }
}