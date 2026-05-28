import type { Deal } from "@/lib/crm/core/crm-entities";
import { dealService } from "@/lib/crm/services/deal-service";
import { salesAgent } from "@/lib/crm/agent/sales-agent-orchestrator";
import { BaseAgent, type AgentTask, type AgentType, type AgentCapability } from "../agent-swarm/agent-types";

export type ConversionOpportunity = {
  dealId: string;
  probability: number;
  nextSteps: string[];
  estimatedCloseValue?: number;
};

export class ConversionAgent extends BaseAgent {
  readonly id = "conversion-agent";
  readonly type: AgentType = "sales";
  readonly capabilities: AgentCapability[] = [
    { name: "conversion_prediction", version: "1.0", description: "Predicts deal conversion likelihood" },
    { name: "pipeline_optimization", version: "1.0", description: "Optimizes deal progression" },
  ];

  async analyzeDeal(deal: Deal): Promise<ConversionOpportunity> {
    const probability = this.predictConversion(deal);
    
    const opportunity: ConversionOpportunity = {
      dealId: deal.id,
      probability,
      nextSteps: this.suggestNextSteps(deal, probability),
      estimatedCloseValue: deal.value * probability / 100,
    };

    if (probability >= 80 && deal.stage !== "closed_won") {
      await this.triggerConversion(deal, opportunity);
    }

    return opportunity;
  }

  private predictConversion(deal: Deal): number {
    let probability = deal.probability ?? 50;
    
    if (deal.stage === "proposal") probability += 20;
    if (deal.stage === "negotiation") probability += 30;
    if (deal.stage === "closed_won") probability = 100;
    
    return Math.min(Math.round(probability), 100);
  }

  private suggestNextSteps(deal: Deal, probability: number): string[] {
    if (probability >= 80) return ["schedule_closing_call", "send_contract"];
    if (probability >= 50) return ["follow_up_this_week", "address_concerns"];
    if (probability >= 30) return ["re_qualify_lead", "offer_discount"];
    return ["consider_lost", "archived"];
  }

  private async triggerConversion(deal: Deal, opportunity: ConversionOpportunity): Promise<void> {
    salesAgent.runAutonomousCycle({
      tenantId: deal.tenantId,
      signals: [{
        id: `sig_${Date.now()}`,
        type: "high_intent",
        entityType: "deal",
        entityId: deal.id,
        severity: "info",
        message: "High conversion probability detected",
        detectedAt: new Date().toISOString(),
      }],
    }).catch(console.error);
  }

  async onTask(task: AgentTask): Promise<void> {
    this.setStatus("in_progress");
    
    if (task.type === "analyze_deals") {
      const deals = await dealService.list(task.tenantId);
      for (const deal of deals) {
        await this.analyzeDeal(deal);
      }
    }
    
    this.setStatus("idle");
  }
}

export const conversionAgent = new ConversionAgent();