import type { AgentTask } from "@/lib/agent-swarm/agent-types";
import { emitEvent } from "@/lib/event-bus";

export type SafetyViolation = {
  tenantId: string;
  actionId: string;
  type: "rate_limit" | "policy_violation" | "conflict_detected";
  message: string;
  blockedAt: string;
};

export class SystemSafetyController {
  private blockedTenants: Set<string> = new Set();
  private violations: SafetyViolation[] = [];

  async validate(task: AgentTask): Promise<boolean> {
    if (this.blockedTenants.has(task.tenantId)) {
      return false;
    }

    return true;
  }

  emergencyStop(tenantId: string, reason: string): void {
    this.blockedTenants.add(tenantId);

    emitEvent({
      id: `evt_${Date.now()}`,
      type: "autonomous.emergency_stop",
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { reason },
      version: "1.0",
    });
  }

  resume(tenantId: string): void {
    this.blockedTenants.delete(tenantId);
  }

  recordViolation(violation: SafetyViolation): void {
    this.violations.push(violation);
  }

  getViolations(tenantId: string): SafetyViolation[] {
    return this.violations.filter((v) => v.tenantId === tenantId);
  }
}