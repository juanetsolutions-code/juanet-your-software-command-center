import type { ActivityType } from "../core/crm-types";

export type CrmTask = {
  id: string;
  tenantId: string;
  entityType: "lead" | "contact" | "deal" | "account";
  entityId: string;
  title: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  createdBy?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  type: ActivityType;
  reminderMinutes?: number;
};

export type TaskFilter = {
  assignedTo?: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  dueBefore?: string;
  dueAfter?: string;
  entityType?: "lead" | "contact" | "deal" | "account";
};

export class TaskService {
  private tasks: Map<string, CrmTask> = new Map();

  async create(data: Omit<CrmTask, "id" | "status" | "completedAt">): Promise<CrmTask> {
    const task: CrmTask = {
      ...data,
      id: this.generateId(),
      status: "pending",
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async findById(id: string, tenantId: string): Promise<CrmTask | undefined> {
    const task = this.tasks.get(id);
    if (!task || task.tenantId !== tenantId) return undefined;
    return task;
  }

  async findByEntity(
    tenantId: string,
    entityType: "lead" | "contact" | "deal" | "account",
    entityId: string
  ): Promise<CrmTask[]> {
    return Array.from(this.tasks.values()).filter(
      (t) => t.tenantId === tenantId && t.entityType === entityType && t.entityId === entityId
    );
  }

  async findByAssignee(tenantId: string, userId: string): Promise<CrmTask[]> {
    return Array.from(this.tasks.values()).filter(
      (t) => t.tenantId === tenantId && t.assignedTo === userId && t.status === "pending"
    );
  }

  async update(id: string, tenantId: string, updates: Partial<CrmTask>): Promise<CrmTask | undefined> {
    const task = await this.findById(id, tenantId);
    if (!task) return undefined;
    const updated = { ...task, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  async complete(id: string, tenantId: string): Promise<CrmTask | undefined> {
    return this.update(id, tenantId, { status: "completed", completedAt: new Date().toISOString() });
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const task = await this.findById(id, tenantId);
    if (!task) return false;
    return this.tasks.delete(id);
  }

  async getUpcoming(tenantId: string, hours: number = 24): Promise<CrmTask[]> {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return Array.from(this.tasks.values()).filter(
      (t) => t.tenantId === tenantId && t.status === "pending" && t.dueDate && new Date(t.dueDate) <= future
    );
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

export const taskService = new TaskService();