import { scheduleJob } from "@/lib/jobs";
import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";
import { salesAgent } from "./sales-agent-orchestrator";
import { signalEngine, type Signal } from "../signals/signal-engine";
import { actionRouter } from "./actions/action-router";
import { dealService } from "../services/deal-service";
import { leadService } from "../services/lead-service";

export class CrmWorkflowAutomation {
  scheduleNightlyScan(tenantId: string): void {
    scheduleJob("crm_nightly_scan", { tenantId }, { priority: "background" });
  }

  scheduleFollowupWorkflow(lead: Lead): void {
    if (!lead.nextFollowUp) return;
    
    scheduleJob("lead_followup", { 
      tenantId: lead.tenantId, 
      leadId: lead.id 
    }, { scheduledAt: lead.nextFollowUp });
  }

  async runAutonomousScan(tenantId: string): Promise<{ signals: number; actions: number }> {
    const deals = await dealService.list(tenantId);
    const leads = await leadService.list(tenantId);
    
    const signals: Signal[] = [];
    
    for (const deal of deals) {
      const daysSinceUpdate = deal.updatedAt 
        ? Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      const signal = signalEngine.detect(deal, daysSinceUpdate);
      if (signal) signals.push(signal);
    }
    
    for (const lead of leads) {
      const signal = signalEngine.detectLead(lead);
      if (signal) signals.push(signal);
    }
    
    const decisions = await salesAgent.evaluate({ tenantId, signals });
    
    let actionsExecuted = 0;
    for (const decision of decisions) {
      const { action } = decision;
      if (!action.requiresApproval) {
        const result = await actionRouter.route(decision, { tenantId });
        if (result.success) actionsExecuted++;
      }
    }
    
    return { signals: signals.length, actions: actionsExecuted };
  }

  schedulePeriodicScan(tenantId: string, hours: number = 1): void {
    scheduleJob("crm_autonomous_scan", { tenantId }, { priority: "background" });
  }

  async processStaleDeals(tenantId: string, daysThreshold: number = 7): Promise<number> {
    const deals = await dealService.list(tenantId);
    let actionsCreated = 0;
    
    for (const deal of deals) {
      if (!deal.updatedAt || deal.stage === "closed_won" || deal.stage === "closed_lost") {
        continue;
      }
      
      const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      
      if (days >= daysThreshold) {
        const level = salesAgent.getAutonomyLevel(tenantId);
        if (level !== "off") {
          await salesAgent.runAutonomousCycle({ tenantId });
          actionsCreated++;
        }
      }
    }
    
    return actionsCreated;
  }
}