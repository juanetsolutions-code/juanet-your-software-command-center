/**
 * AI Orchestrator - Coordinates multiple agents and complex tasks.
 */

import { decisionEngine } from "@/lib/ai-decisions/decision-engine";
import { buildReasoningContext } from "@/lib/ai-decisions/reasoning-context";

export class AIOrchestrator {
  async orchestrateComplexTask(task: string, tenantId: string, context: any = {}): Promise<any> {
    const reasoning = buildReasoningContext({ tenantId, ...context });

    const decision = await decisionEngine.makeDecision(reasoning);

    // Simple planner stub
    const plan = {
      task,
      steps: [
        { agent: "finance", action: "analyze" },
        { agent: "ops", action: "execute" },
      ],
      decision,
    };

    return plan;
  }
}

export const aiOrchestrator = new AIOrchestrator();
