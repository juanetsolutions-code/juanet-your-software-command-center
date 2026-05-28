import type { SalesSummary } from "./daily-sales-summary";

export type ActionPriority = {
  id: string;
  type: "call" | "email" | "meeting" | "followup";
  target: string;
  priority: "urgent" | "high" | "medium" | "low";
  estimatedValue: number;
};

export class ActionPrioritizer {
  prioritize(summary: SalesSummary): ActionPriority[] {
    const actions: ActionPriority[] = [];

    for (const lead of summary.hotLeads) {
      actions.push({
        id: `action_${lead.id}`,
        type: "call",
        target: `${lead.firstName} ${lead.lastName}`,
        priority: lead.score && lead.score >= 85 ? "urgent" : "high",
        estimatedValue: lead.value ?? 1000,
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}