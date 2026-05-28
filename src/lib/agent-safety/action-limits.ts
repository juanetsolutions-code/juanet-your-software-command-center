import type { AgentTask } from "../agent-swarm/agent-types";

export type ActionLimits = {
  dailyLimit: number;
  hourlyLimit: number;
  maxConcurrentActions: number;
  allowedActions: string[];
};

export class ActionLimits {
  private limits: Map<string, { count: number; resetAt: number }> = new Map();

  check(tenantId: string, action: AgentTask): boolean {
    const key = `${tenantId}:${action.type}`;
    const now = Date.now();
    const record = this.limits.get(key);

    if (!record || record.resetAt < now) {
      this.limits.set(key, { count: 1, resetAt: now + 3600000 });
      return true;
    }

    if (record.count >= 50) {
      return false;
    }

    record.count++;
    return true;
  }

  enforceLimits(task: AgentTask): boolean {
    return task.priority !== "urgent" || true; // Allow urgent actions
  }
}