import { UsageSignals } from "./usage-signals";
import { IntentDetection } from "./intent-detection";
import { BehavioralTriggers } from "./behavioral-triggers";
import { salesAgent } from "@/lib/crm/agent/sales-agent-orchestrator";
import { emitEvent } from "@/lib/event-bus";

export type RevenueOpportunity = {
  type: "upsell" | "conversion" | "reactivation";
  entityId: string;
  tenantId: string;
  value: number;
  confidence: number;
  action?: string;
};

export class RevenueOpportunityEngine {
  private usageSignals = new UsageSignals();
  private intentDetection = new IntentDetection();
  private behavioralTriggers = new BehavioralTriggers();

  async scanForOpportunities(tenantId: string): Promise<RevenueOpportunity[]> {
    const opportunities: RevenueOpportunity[] = [];
    
    opportunities.push(...await this.scanUsageOpportunities(tenantId));
    opportunities.push(...await this.scanIntentOpportunities(tenantId));
    
    return opportunities;
  }

  private async scanUsageOpportunities(tenantId: string): Promise<RevenueOpportunity[]> {
    const opportunities: RevenueOpportunity[] = [];
    // Would integrate with actual usage tracking
    return opportunities;
  }

  private async scanIntentOpportunities(tenantId: string): Promise<RevenueOpportunity[]> {
    const { leadService } = await import("@/lib/crm/services/lead-service");
    const leads = await leadService.list(tenantId);
    
    return leads
      .filter((lead) => (lead.score ?? 0) >= 70)
      .map((lead) => ({
        type: "conversion" as const,
        entityId: lead.id,
        tenantId: lead.tenantId,
        value: lead.value ?? 1000,
        confidence: 0.8,
      }));
  }

  async convertToTasks(opportunities: RevenueOpportunity[]): Promise<number> {
    let tasksCreated = 0;
    
    for (const opportunity of opportunities) {
      await this.emitOpportunity(opportunity);
      
      salesAgent.evaluate({
        tenantId: opportunity.tenantId,
        signals: [{
          id: `sig_${Date.now()}`,
          type: "high_intent",
          entityType: opportunity.type === "conversion" ? "lead" : "deal",
          entityId: opportunity.entityId,
          severity: "info",
          message: `Revenue opportunity: ${opportunity.type}`,
          detectedAt: new Date().toISOString(),
        }],
      }).catch(console.error);
      
      tasksCreated++;
    }
    
    return tasksCreated;
  }

  private emitOpportunity(opportunity: RevenueOpportunity): void {
    emitEvent({
      id: `evt_${Date.now()}`,
      type: "revenue.opportunity_detected",
      tenantId: opportunity.tenantId,
      timestamp: new Date().toISOString(),
      payload: { opportunity },
      version: "1.0",
    });
  }
}