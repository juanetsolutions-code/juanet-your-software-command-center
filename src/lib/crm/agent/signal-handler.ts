import type { DomainEvent } from "@/lib/event-bus";
import { registerEventHandler, emitEvent } from "@/lib/event-bus";
import { salesAgent } from "@/lib/crm/agent/sales-agent-orchestrator";
import { actionRouter } from "@/lib/crm/agent/actions/action-router";
import type { Signal } from "@/lib/crm/signals/signal-engine";
import { salesMemory } from "@/lib/crm/agent/memory/sales-memory-store";

registerEventHandler({
  id: "crm-signal-handler",
  eventType: "crm.signal_detected",
  handler: async (event: DomainEvent) => {
    const { tenantId, signal } = event.payload as { tenantId: string; signal: Signal };
    
    if (!signal || !tenantId) return;
    
    const actions = await salesAgent.evaluate({ tenantId, signals: [signal] });
    
    for (const decision of actions) {
      const { action } = decision;
      
      if (!action.requiresApproval) {
        const result = await actionRouter.route(decision, { tenantId });
        
        if (result.success) {
          salesMemory.store({
            id: action.id,
            tenantId,
            action,
            outcome: "success",
            executedAt: new Date().toISOString(),
            result: result.result,
          });
        }
      }
    }
  },
  priority: 10,
  tenantScoped: true,
});

registerEventHandler({
  id: "deal-updated-agent-trigger",
  eventType: "deal.updated",
  handler: async (event: DomainEvent) => {
    const { tenantId, dealId, changes } = event.payload as { 
      tenantId: string; 
      dealId: string; 
      changes: Record<string, unknown> 
    };
    
    if (!tenantId || !dealId) return;
    
    const level = salesAgent.getAutonomyLevel(tenantId);
    if (level === "off") return;
    
    if (typeof changes.stage === "string") {
      const signal = {
        id: `sig_${Date.now()}`,
        type: "deal_stuck",
        entityType: "deal",
        entityId: dealId,
        severity: "info",
        message: `Deal stage changed to ${changes.stage}`,
        detectedAt: new Date().toISOString(),
      };
      
      const actions = await salesAgent.evaluate({ tenantId, signals: [signal] });
      for (const decision of actions) {
        if (!decision.action.requiresApproval) {
          await actionRouter.route(decision, { tenantId });
        }
      }
    }
  },
  priority: 5,
  tenantScoped: true,
});

export const signalHandlersRegistered = true;