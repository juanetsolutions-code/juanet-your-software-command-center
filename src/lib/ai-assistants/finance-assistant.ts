/**
 * Finance Assistant - Specialized agent for billing, invoices, usage.
 */

import { BaseAIAgent } from '@/lib/ai-agents/agent-core';
import type { AgentConfig, AgentExecutionResult } from '@/lib/ai-agents/agent-types';
import { decisionEngine } from '@/lib/ai-decisions/decision-engine';
import { buildReasoningContext } from '@/lib/ai-decisions/reasoning-context';

export class FinanceAssistant extends BaseAIAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async executeTask(task: string, context: Record<string, any>): Promise<AgentExecutionResult> {
    const reasoningInput = buildReasoningContext({ ...context, tenantId: this.config.tenantId });
    const decision = await decisionEngine.makeDecision(reasoningInput);

    // Use tools via executor (stub for now)
    return {
      success: true,
      output: `Finance decision: ${decision.action}`,
      actionsTaken: ['analyze_usage', decision.action],
      confidence: decision.confidence,
      reasoningTrace: decision.reasoningTrace,
    };
  }

  async planActions(task: string) {
    return []; // populated in full impl
  }
}
