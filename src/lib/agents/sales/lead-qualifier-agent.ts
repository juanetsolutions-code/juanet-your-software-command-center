import type { Lead } from "@/lib/crm/core/crm-entities";
import { leadService } from "@/lib/crm/services/lead-service";
import { taskService } from "@/lib/crm/tasks/task-service";
import { BaseAgent, type AgentTask, type AgentType, type AgentCapability } from "../agent-swarm/agent-types";

export type LeadQualification = {
  leadId: string;
  score: number;
  tier: "cold" | "warm" | "hot" | "ready";
  nextAction: string;
  estimatedValue?: number;
};

export class LeadQualifierAgent extends BaseAgent {
  readonly id = "lead-qualifier";
  readonly type: AgentType = "sales";
  readonly capabilities: AgentCapability[] = [
    { name: "lead_scoring", version: "1.0", description: "Scores and qualifies leads" },
    { name: "tier_classification", version: "1.0", description: "Classifies leads into tiers" },
  ];

  async qualify(lead: Lead): Promise<LeadQualification> {
    const qualification = this.calculateQualification(lead);
    
    await leadService.update(lead.id, lead.tenantId, {
      score: qualification.score,
    });

    if (qualification.tier === "hot" || qualification.tier === "ready") {
      await this.createUrgentTask(lead, qualification);
    }

    return qualification;
  }

  private calculateQualification(lead: Lead): LeadQualification {
    let score = lead.score ?? 0;
    let tier: "cold" | "warm" | "hot" | "ready" = "cold";
    
    const tags = lead.tags ?? [];
    
    if (tags.includes("demo_completed")) score += 30;
    if (tags.includes("email_opened")) score += 15;
    if (tags.includes("pricing_viewed")) score += 25;
    if (tags.includes("api_used")) score += 20;
    
    if (score >= 85) tier = "ready";
    else if (score >= 70) tier = "hot";
    else if (score >= 50) tier = "warm";
    else tier = "cold";
    
    return {
      leadId: lead.id,
      score,
      tier,
      nextAction: this.getNextAction(tier),
      estimatedValue: tier === "ready" ? 5000 : tier === "hot" ? 3000 : tier === "warm" ? 1000 : 500,
    };
  }

  private getNextAction(tier: string): string {
    switch (tier) {
      case "ready": return "immediate_call";
      case "hot": return "next_morning_followup";
      case "warm": return "nurture_sequence";
      default: return "monitor";
    }
  }

  private async createUrgentTask(lead: Lead, qualification: LeadQualification): Promise<void> {
    await taskService.create({
      tenantId: lead.tenantId,
      entityType: "lead",
      entityId: lead.id,
      title: `Hot lead ${qualification.tier} - immediate action`,
      type: "call",
      priority: "urgent",
    });
  }

  async onTask(task: AgentTask): Promise<void> {
    this.setStatus("in_progress");
    
    if (task.type === "qualify_leads") {
      const leads = await leadService.list(task.tenantId);
      for (const lead of leads) {
        await this.qualify(lead);
      }
    }
    
    this.setStatus("idle");
  }
}

export const leadQualifierAgent = new LeadQualifierAgent();