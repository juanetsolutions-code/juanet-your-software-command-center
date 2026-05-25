/**
 * Execution Insights
 * Generates human and AI readable insights from workflow executions.
 */

import type { WorkflowExecutionTrace } from "./workflow-learning";

export interface ExecutionInsight {
  workflowId: string;
  tenantId: string;
  summary: string;
  keyMetrics: Record<string, number>;
  improvementOpportunities: string[];
  confidence: number;
}

export class ExecutionInsights {
  generate(trace: WorkflowExecutionTrace, patterns: Record<string, any>): ExecutionInsight {
    return {
      workflowId: trace.workflowId,
      tenantId: trace.tenantId,
      summary: `${trace.outcome.toUpperCase()} run of ${trace.stepsExecuted} steps in ${trace.durationMs}ms`,
      keyMetrics: {
        duration: trace.durationMs,
        steps: trace.stepsExecuted,
        bottleneckCount: trace.bottlenecks.length,
      },
      improvementOpportunities: patterns.commonBottlenecks || [],
      confidence: trace.outcome === "success" ? 0.85 : 0.6,
    };
  }
}

export const executionInsights = new ExecutionInsights();
