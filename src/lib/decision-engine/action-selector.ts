import type { AgentTask } from "../agent-swarm/agent-types";

export type SelectedAction = {
  action: AgentTask;
  confidence: number;
  reason: string;
};

export class ActionSelector {
  select(tasks: AgentTask[]): SelectedAction[] {
    return tasks.map((task) => ({
      action: task,
      confidence: this.calculateConfidence(task),
      reason: this.determineReason(task),
    }));
  }

  private calculateConfidence(task: AgentTask): number {
    const priority = task.priority;
    const typeConfidence: Record<string, number> = {
      "hunt_leads": 0.9,
      "qualify_leads": 0.85,
      "analyze_deals": 0.8,
      "check_deals": 0.75,
    };
    
    return typeConfidence[task.type] ?? 0.5;
  }

  private determineReason(task: AgentTask): string {
    switch (task.type) {
      case "hunt_leads": return "Proactive lead discovery";
      case "qualify_leads": return "Lead scoring and qualification";
      case "analyze_deals": return "Deal conversion analysis";
      case "check_deals": return "Deal follow-up monitoring";
      default: return "Standard business operation";
    }
  }
}