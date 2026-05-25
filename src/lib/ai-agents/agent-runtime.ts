/**
 * AI Agent Runtime
 * Handles execution lifecycle, tool calling, and multi-turn reasoning for agents.
 */

import type { AgentConfig, AgentExecutionResult } from "./agent-types";
import { BaseAIAgent } from "./agent-core";

export class AgentRuntime {
  private agents: Map<string, BaseAIAgent> = new Map();

  registerAgent(agent: BaseAIAgent): void {
    const config = agent.getConfig();
    this.agents.set(config.id, agent);
  }

  getAgent(agentId: string): BaseAIAgent | undefined {
    return this.agents.get(agentId);
  }

  async runAgent(
    agentId: string,
    task: string,
    context: Record<string, any> = {},
  ): Promise<AgentExecutionResult> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return {
        success: false,
        error: `Agent ${agentId} not found`,
        actionsTaken: [],
      };
    }

    // Enforce tenant isolation
    const config = agent.getConfig();
    if (context.tenantId && context.tenantId !== config.tenantId) {
      return {
        success: false,
        error: "Tenant mismatch - agent cannot operate across tenants",
        actionsTaken: [],
      };
    }

    // Basic tool-using loop (max 5 iterations for safety)
    let iterations = 0;
    let lastResult: any = null;
    const actionsTaken: string[] = [];

    while (iterations < 5) {
      const result = await agent.executeTask(task, { ...context, previousResult: lastResult });
      actionsTaken.push(...(result.actionsTaken || []));

      // If the agent returned planned tool calls, execute them via the tool system
      if (result.plannedTools && result.plannedTools.length > 0) {
        const { executeToolCall } = await import("@/lib/ai-tools/tool-executor");
        for (const toolCall of result.plannedTools) {
          const toolResult = await executeToolCall(toolCall as any, {
            tenantId: config.tenantId,
            userId: context.userId,
            permissions: config.allowedTools,
          });
          actionsTaken.push(`tool:${toolCall.tool}`);
          lastResult = toolResult;
        }
      }

      if (result.success && !result.plannedTools) {
        return { ...result, actionsTaken };
      }

      iterations++;
    }

    return {
      success: false,
      error: "Agent reached max iterations",
      actionsTaken,
    };
  }

  listAgentsForTenant(tenantId: string): string[] {
    return Array.from(this.agents.values())
      .filter((a) => a.getConfig().tenantId === tenantId)
      .map((a) => a.getConfig().id);
  }
}

export const agentRuntime = new AgentRuntime();
