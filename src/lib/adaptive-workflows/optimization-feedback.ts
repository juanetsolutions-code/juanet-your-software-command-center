/**
 * Optimization Feedback
 * Closed-loop feedback from workflow outcomes into optimization models.
 */

import type { WorkflowExecutionTrace } from "./workflow-learning";

export interface FeedbackSignal {
  workflowId: string;
  tenantId: string;
  metric: string;
  delta: number;
  cause: string;
}

export class OptimizationFeedback {
  processTrace(trace: WorkflowExecutionTrace): FeedbackSignal[] {
    const signals: FeedbackSignal[] = [];
    if (trace.outcome !== "success") {
      signals.push({
        workflowId: trace.workflowId,
        tenantId: trace.tenantId,
        metric: "success_rate",
        delta: -0.15,
        cause: "execution_failure",
      });
    }
    if (trace.bottlenecks.length > 1) {
      signals.push({
        workflowId: trace.workflowId,
        tenantId: trace.tenantId,
        metric: "bottleneck_count",
        delta: trace.bottlenecks.length * 0.1,
        cause: "step_dependency",
      });
    }
    return signals;
  }
}

export const optimizationFeedback = new OptimizationFeedback();
