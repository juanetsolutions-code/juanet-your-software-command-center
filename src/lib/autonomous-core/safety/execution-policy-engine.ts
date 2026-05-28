import type { AgentTask } from "@/lib/agent-swarm/agent-types";

export type ExecutionPolicy = {
  tenantId: string;
  maxActionsPerHour: number;
  maxActionsPerDay: number;
  allowedTypes: string[];
  quietHours: { start: number; end: number };
};

export class ExecutionPolicyEngine {
  private policies: Map<string, ExecutionPolicy> = new Map();
  private counters: Map<string, { count: number; resetAt: number }> = new Map();

  setPolicy(tenantId: string, policy: ExecutionPolicy): void {
    this.policies.set(tenantId, policy);
  }

  getPolicy(tenantId: string): ExecutionPolicy {
    return this.policies.get(tenantId) ?? {
      tenantId,
      maxActionsPerHour: 50,
      maxActionsPerDay: 200,
      allowedTypes: ["*"],
      quietHours: { start: 22, end: 6 },
    };
  }

  canExecute(task: AgentTask): boolean {
    const policy = this.getPolicy(task.tenantId);
    const now = new Date();

    if (now.getHours() >= policy.quietHours.start || now.getHours() <= policy.quietHours.end) {
      if (!task.payload.allowQuietHours) {
        return false;
      }
    }

    const actionType = task.type;
    if (policy.allowedTypes[0] !== "*" && !policy.allowedTypes.includes(actionType)) {
      return false;
    }

    return this.checkRateLimit(task.tenantId);
  }

  private checkRateLimit(tenantId: string): boolean {
    const now = Date.now();
    const hourKey = `${tenantId}:hour`;
    const dayKey = `${tenantId}:day`;

    const hourCounter = this.counters.get(hourKey) ?? { count: 0, resetAt: now + 3600000 };
    const dayCounter = this.counters.get(dayKey) ?? { count: 0, resetAt: now + 86400000 };

    const policy = this.getPolicy(tenantId);

    if (hourCounter.resetAt < now) {
      hourCounter.count = 0;
      hourCounter.resetAt = now + 3600000;
    }

    if (dayCounter.resetAt < now) {
      dayCounter.count = 0;
      dayCounter.resetAt = now + 86400000;
    }

    if (hourCounter.count >= policy.maxActionsPerHour || dayCounter.count >= policy.maxActionsPerDay) {
      return false;
    }

    hourCounter.count++;
    dayCounter.count++;
    this.counters.set(hourKey, hourCounter);
    this.counters.set(dayKey, dayCounter);

    return true;
  }
}