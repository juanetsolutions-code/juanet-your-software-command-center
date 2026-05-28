import type { CrmTask } from "./task-service";
import { taskService } from "./task-service";

export type FollowupRule = {
  entityType: "lead" | "contact" | "deal";
  trigger: "created" | "updated" | "stage_changed" | "status_changed";
  delayHours?: number;
  taskTemplate: {
    title: string;
    type: string;
    priority: "low" | "medium" | "high" | "urgent";
  };
};

export class FollowupEngine {
  private rules: FollowupRule[] = [
    {
      entityType: "lead",
      trigger: "created",
      delayHours: 24,
      taskTemplate: { title: "Initial follow-up", type: "call", priority: "high" },
    },
    {
      entityType: "lead",
      trigger: "status_changed",
      delayHours: 48,
      taskTemplate: { title: "Check lead progress", type: "email", priority: "medium" },
    },
    {
      entityType: "deal",
      trigger: "stage_changed",
      taskTemplate: { title: "Follow-up on deal update", type: "call", priority: "high" },
    },
  ];

  async createFollowup(
    tenantId: string,
    entityType: "lead" | "contact" | "deal",
    entityId: string,
    assignedTo?: string
  ): Promise<CrmTask | undefined> {
    const rule = this.rules.find((r) => r.entityType === entityType && r.trigger === "created");
    if (!rule) return undefined;

    const dueDate = rule.delayHours
      ? new Date(Date.now() + rule.delayHours * 60 * 60 * 1000).toISOString()
      : undefined;

    return taskService.create({
      tenantId,
      entityType,
      entityId,
      title: rule.taskTemplate.title,
      type: rule.taskTemplate.type as "call" | "email" | "meeting" | "note" | "task" | "demo" | "proposal",
      priority: rule.taskTemplate.priority,
      assignedTo,
      dueDate,
    });
  }

  registerRule(rule: FollowupRule): void {
    this.rules.push(rule);
  }
}

export const followupEngine = new FollowupEngine();