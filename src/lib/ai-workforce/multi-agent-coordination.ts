import type { WorkforceAgent } from "./ai-agent-registry";

export interface CoordinationPlan {
  id: string;
  goal: string;
  steps: Array<{ agentId: string; action: string; dependsOn?: string[] }>;
}

export function buildSequentialPlan(goal: string, agents: WorkforceAgent[]): CoordinationPlan {
  return {
    id: `plan_${Date.now()}`,
    goal,
    steps: agents.map((a, i) => ({
      agentId: a.id,
      action: `step_${i + 1}`,
      dependsOn: i > 0 ? [`step_${i}`] : undefined,
    })),
  };
}
