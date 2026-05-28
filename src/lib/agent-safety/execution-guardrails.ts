import type { AgentTask } from "../agent-swarm/agent-types";

export type ValidationResult = {
  valid: boolean;
  reason?: string;
  actionAllowed: boolean;
};

export class ExecutionGuardrails {
  validate(task: AgentTask, tenantConfig?: Record<string, unknown>): ValidationResult {
    if (!task.tenantId) {
      return { valid: false, reason: "Missing tenant context", actionAllowed: false };
    }

    const enabled = tenantConfig?.autonomousSales ?? true;
    if (!enabled) {
      return { valid: false, reason: "Autonomous sales disabled for tenant", actionAllowed: false };
    }

    const offHours = this.isOffHours();
    const weekend = this.isWeekend();

    if (offHours && weekend) {
      return { valid: false, reason: "Weekend off-hours", actionAllowed: false };
    }

    return { valid: true, actionAllowed: true };
  }

  private isOffHours(): boolean {
    const hour = new Date().getHours();
    return hour < 8 || hour > 18;
  }

  private isWeekend(): boolean {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  }
}