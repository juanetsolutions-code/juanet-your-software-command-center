import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export type WorkItem = {
  id: string;
  type: "lead" | "deal" | "task";
  priority: number;
  score: number;
  title: string;
  dueDate?: string;
  entity: Lead | Deal;
};

export class WorkPriorityEngine {
  prioritize(items: Array<{ type: "lead"; entity: Lead } | { type: "deal"; entity: Deal }>): WorkItem[] {
    return items
      .map((item) => ({
        id: item.entity.id,
        type: item.type,
        score: this.calculateScore(item),
        priority: this.calculateScore(item),
        title: this.getTitle(item),
        entity: item.entity,
      }))
      .sort((a, b) => b.score - a.score)
      .map((w, i) => ({ ...w, priority: items.length - i }));
  }

  getTopActions(tenantId: string, items: WorkItem[], limit: number = 10): WorkItem[] {
    return items.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private calculateScore(item: { type: "lead"; entity: Lead } | { type: "deal"; entity: Deal }): number {
    if (item.type === "lead") {
      let score = 50;
      const lead = item.entity;
      if (lead.score) score += lead.score;
      if (lead.assignedTo) score += 10;
      return Math.min(100, score);
    }
    
    if (item.type === "deal") {
      const deal = item.entity;
      return deal.probability ?? 50;
    }
    
    return 50;
  }

  private getTitle(item: { type: "lead"; entity: Lead } | { type: "deal"; entity: Deal }): string {
    if (item.type === "lead") {
      return `${item.entity.firstName} ${item.entity.lastName}`;
    }
    return item.entity.name;
  }
}

export const workPriorityEngine = new WorkPriorityEngine();