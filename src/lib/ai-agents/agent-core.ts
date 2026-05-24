/**
 * AI Agent Core
 * Base class and factory for all AI agents.
 * Provides the fundamental structure for tenant-aware, tool-using agents.
 */

import type { AgentConfig, AgentState, AgentExecutionResult, AgentToolCall } from './agent-types';

export abstract class BaseAIAgent {
  protected config: AgentConfig;
  protected state: AgentState;

  constructor(config: AgentConfig) {
    this.config = config;
    this.state = {
      agentId: config.id,
      tenantId: config.tenantId,
      conversationHistory: [],
      context: {},
      lastActivity: new Date().toISOString(),
    };
  }

  public getConfig(): AgentConfig {
    return this.config;
  }

  public getState(): AgentState {
    return this.state;
  }

  public updateContext(newContext: Record<string, any>): void {
    this.state.context = { ...this.state.context, ...newContext };
    this.state.lastActivity = new Date().toISOString();
  }

  // Abstract methods that each specialized agent must implement
  abstract executeTask(task: string, context: Record<string, any>): Promise<AgentExecutionResult>;

  // Optional: agents can override to return planned tool calls
  async planActions(task: string): Promise<AgentToolCall[]> {
    return [];
  }
}

export function createAgent(config: AgentConfig): BaseAIAgent {
  // Factory will be expanded in ai-assistants/
  // For now, return a generic implementation
  return new GenericAIAgent(config);
}

class GenericAIAgent extends BaseAIAgent {
  async executeTask(task: string, context: Record<string, any>): Promise<AgentExecutionResult> {
    this.updateContext(context);

    // Simple demonstration: plan to use queryMetrics for any task
    const planned: AgentToolCall[] = [];
    if (this.config.allowedTools.includes('queryMetrics')) {
      planned.push({
        tool: 'queryMetrics',
        parameters: { metricType: 'tenant_health' },
        reason: 'Gather context before deciding',
      });
    }

    return {
      success: true,
      output: `Task executed by ${this.config.name}: ${task}`,
      actionsTaken: ['analysis'],
      plannedTools: planned,
      confidence: 0.85,
    };
  }

  async planActions(task: string): Promise<AgentToolCall[]> {
    return [];
  }
}
