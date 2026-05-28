import { dealService } from "@/lib/crm/services/deal-service";
import { leadService } from "@/lib/crm/services/lead-service";
import { taskService } from "@/lib/crm/tasks/task-service";

export type CustomerJourney = {
  leadId: string;
  accountId?: string;
  touchpoints: Array<{
    type: "email" | "call" | "meeting" | "demo";
    date: string;
    outcome?: string;
  }>;
  score: number;
  nextRecommendedAction?: string;
};

export class CustomerJourneyAI {
  async mapJourney(leadId: string, tenantId: string): Promise<CustomerJourney> {
    const lead = await leadService.getById(leadId, tenantId);
    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    const touchpoints = await this.getTouchpoints(leadId, tenantId);
    
    return {
      leadId,
      accountId: lead.company ? undefined : undefined,
      touchpoints,
      score: lead.score ?? 50,
      nextRecommendedAction: this.getNextAction(lead),
    };
  }

  private async getTouchpoints(leadId: string, tenantId: string): Promise<CustomerJourney["touchpoints"]> {
    const tasks = await taskService.findByEntity(tenantId, "lead", leadId);
    
    return tasks.map((task) => ({
      type: task.type === "call" ? "call" : 
            task.type === "email" ? "email" : 
            "meeting",
      date: task.createdAt,
      outcome: task.completedAt ? "completed" : "pending",
    }));
  }

  private getNextAction(lead: { score?: number; status: string; lastContactedAt?: string }): string {
    if ((lead.score ?? 0) >= 80) return "schedule_closing_call";
    if (lead.status === "new") return "make_first_contact";
    if (!lead.lastContactedAt) return "initial_outreach";
    
    const days = Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days > 7) return "follow_up";
    
    return "nurture_sequence";
  }

  async suggestOptimizations(tenantId: string): Promise<string[]> {
    const leads = await leadService.list(tenantId);
    const suggestions: string[] = [];

    const avgScore = leads.reduce((sum, l) => sum + (l.score ?? 0), 0) / leads.length;
    if (avgScore < 30) {
      suggestions.push("Low average lead score - improve lead capture");
    }

    const uncontacted = leads.filter((l) => !l.lastContactedAt).length;
    if (uncontacted > leads.length * 0.3) {
      suggestions.push("Many leads never contacted - automate first touch");
    }

    return suggestions;
  }
}