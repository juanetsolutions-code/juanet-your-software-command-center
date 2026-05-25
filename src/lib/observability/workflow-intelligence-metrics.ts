/**
 * Workflow Intelligence Metrics
 * Telemetry for adaptive workflows, learning, routing decisions, and execution evolution.
 */

import { recordAutonomousEvent, type AutonomousTelemetryEvent } from "./autonomous-telemetry";

export interface WorkflowIntelligenceMetric {
  workflowId: string;
  tenantId: string;
  metric: "learning_update" | "routing_decision" | "execution_insight" | "evolution";
  value: number;
  context: Record<string, any>;
  timestamp: string;
}

const workflowMetrics: WorkflowIntelligenceMetric[] = [];

export function recordWorkflowIntelligence(
  tenantId: string,
  workflowId: string,
  metric: WorkflowIntelligenceMetric["metric"],
  value: number,
  context: Record<string, any> = {},
): void {
  const entry: WorkflowIntelligenceMetric = {
    workflowId,
    tenantId,
    metric,
    value,
    context,
    timestamp: new Date().toISOString(),
  };
  workflowMetrics.push(entry);

  recordAutonomousEvent(tenantId, "autonomous-ops", `workflow_${metric}`, { workflowId, value });
}

export function getWorkflowIntelligenceMetrics(
  tenantId?: string,
  limit = 100,
): WorkflowIntelligenceMetric[] {
  let res = workflowMetrics;
  if (tenantId) res = res.filter((m) => m.tenantId === tenantId);
  return res.slice(-limit);
}
