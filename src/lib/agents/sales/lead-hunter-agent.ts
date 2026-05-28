import type { Lead } from "@/lib/crm/core/crm-entities";
import { leadService } from "@/lib/crm/services/lead-service";
import { salesAgent } from "@/lib/crm/agent/sales-agent-orchestrator";
import { BaseAgent, type AgentTask, type AgentType, type AgentCapability } from "../agent-swarm/agent-types";

export class LeadHunterAgent extends BaseAgent {
  readonly id = "lead-hunter";
  readonly type: AgentType = "sales";
  readonly capabilities: AgentCapability[] = [
    { name: "opportunity_detection", version: "1.0", description: "Detects lead opportunities from usage signals" },
    { name: "lead_scoring", version: "1.0", description: "Scores leads based on activity patterns" },
  ];

  async hunt(tenantId: string): Promise<Lead[]> {
    const leads = await leadService.list(tenantId, "new");
    
    const scoredLeads = leads.map((lead) => ({
      ...lead,
      score: this.calculateLeadScore(lead),
    }));
    
    for (const lead of scoredLeads) {
      await leadService.update(lead.id, tenantId, { score: lead.score });
      
      if ((lead.score ?? 0) >= 70) {
        salesAgent.evaluate({ tenantId, leads: [lead] }).catch(console.error);
      }
    }
    
    return scoredLeads;
  }

  private calculateLeadScore(lead: Lead): number {
    let score = lead.score ?? 50;
    
    if (lead.lastContactedAt) {
      const days = Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (days === 0) score += 20;
      else if (days === 1) score += 10;
    }
    
    if (lead.tags.includes("api_user")) score += 15;
    if (lead.tags.includes("frequent_visitor")) score += 10;
    
    return Math.min(Math.round(score), 100);
  }

  async onTask(task: AgentTask): Promise<void> {
    this.setStatus("in_progress");
    
    if (task.type === "hunt_leads") {
      await this.hunt(task.tenantId);
    }
    
    this.setStatus("idle");
  }
}

export const leadHunterAgent = new LeadHunterAgent();