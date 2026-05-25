/**
 * Adaptive Workflow Intelligence - Workflow Learning
 * Learns execution patterns from historical workflow runs
 * to improve future routing and optimization.
 */

export interface WorkflowExecutionTrace {
  workflowId: string;
  tenantId: string;
  stepsExecuted: number;
  durationMs: number;
  outcome: "success" | "partial" | "failed";
  bottlenecks: string[];
  timestamp: string;
}

export class WorkflowLearning {
  private traces: WorkflowExecutionTrace[] = [];

  recordTrace(trace: WorkflowExecutionTrace): void {
    this.traces.push(trace);
    // Keep last 500 per tenant in real impl
  }

  getLearnedPatterns(tenantId: string): Record<string, any> {
    const t = this.traces.filter((tr) => tr.tenantId === tenantId);
    if (!t.length) return { avgDuration: 4500, commonBottlenecks: [] };

    const avg = t.reduce((s, tr) => s + tr.durationMs, 0) / t.length;
    const bottlenecks = Array.from(new Set(t.flatMap((tr) => tr.bottlenecks))).slice(0, 3);

    return { avgDuration: Math.round(avg), commonBottlenecks: bottlenecks, sampleSize: t.length };
  }
}

export const workflowLearning = new WorkflowLearning();
