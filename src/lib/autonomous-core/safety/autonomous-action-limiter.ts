import type { AgentTask } from "@/lib/agent-swarm/agent-types";
import { ExecutionPolicyEngine } from "./execution-policy-engine";

export class AutonomousActionLimiter {
  private policyEngine = new ExecutionPolicyEngine();

  async limit(task: AgentTask): Promise<boolean> {
    const canRun = this.policyEngine.canExecute(task);

    if (!canRun && task.priority === "urgent") {
      return this.evaluateOverride(task);
    }

    return canRun;
  }

  private async evaluateOverride(task: AgentTask): Promise<boolean {
    const policy = this.policyEngine.getPolicy(task.tenantId);
    const urgentAllowed = policy.allowedTypes.includes(task.type);
    return urgentAllowed;
  }
}