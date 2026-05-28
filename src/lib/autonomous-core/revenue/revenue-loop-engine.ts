import { dealService } from "@/lib/crm/services/deal-service";
import { leadService } from "@/lib/crm/services/lead-service";
import { salesAgent } from "@/lib/crm/agent/sales-agent-orchestrator";
import { CrmTriggers } from "@/lib/automation/crm-triggers";

export class RevenueLoopEngine {
  private triggers = new CrmTriggers();

  async runCycle(tenantId: string): Promise<{
    leadsProcessed: number;
    dealsProcessed: number;
    actionsTriggered: number;
    signals: number;
  }> {
    const leads = await leadService.list(tenantId);
    const deals = await dealService.list(tenantId);
    let actionsTriggered = 0;
    let signals = 0;

    for (const lead of leads) {
      await this.triggers.evaluateLead(lead);
      actionsTriggered++;
    }

    for (const deal of deals) {
      await this.triggers.evaluateDeal(deal);
      actionsTriggered++;
    }

    const agentResult = await salesAgent.scanAndAct(tenantId);
    actionsTriggered += agentResult.actionsExecuted;
    signals = agentResult.decisions.length;

    return {
      leadsProcessed: leads.length,
      dealsProcessed: deals.length,
      actionsTriggered,
      signals,
    };
  }
}