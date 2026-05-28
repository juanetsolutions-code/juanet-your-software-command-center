import type { Deal } from "@/lib/crm/core/crm-entities";
import { dealService } from "@/lib/crm/services/deal-service";
import { taskService } from "@/lib/crm/tasks/task-service";
import { BaseAgent, type AgentTask, type AgentType, type AgentCapability } from "../agent-swarm/agent-types";

export class FollowupAgent extends BaseAgent {
  readonly id = "followup-agent";
  readonly type: AgentType = "sales";
  readonly capabilities: AgentCapability[] = [
    { name: "deal_monitoring", version: "1.0", description: "Monitors deals for follow-up opportunities" },
    { name: "task_creation", version: "1.0", description: "Creates follow-up tasks automatically" },
  ];

  async checkDeals(tenantId: string): Promise<number> {
    const deals = await dealService.list(tenantId);
    let followupsCreated = 0;

    for (const deal of deals) {
      if (deal.stage === "closed_won" || deal.stage === "closed_lost") continue;
      
      if (deal.updatedAt) {
        const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
        
        if (days >= 3) {
          await this.createFollowup(deal);
          followupsCreated++;
        }
      }
    }

    return followupsCreated;
  }

  private async createFollowup(deal: Deal): Promise<void> {
    await taskService.create({
      tenantId: deal.tenantId,
      entityType: "deal",
      entityId: deal.id,
      title: `Follow up on ${deal.name}`,
      type: "call",
      priority: "high",
    });
  }

  async onTask(task: AgentTask): Promise<void> {
    this.setStatus("in_progress");
    
    if (task.type === "check_deals") {
      await this.checkDeals(task.tenantId);
    }
    
    this.setStatus("idle");
  }
}

export const followupAgent = new FollowupAgent();