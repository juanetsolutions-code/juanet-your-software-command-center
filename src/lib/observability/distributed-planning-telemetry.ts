/**
 * Distributed Planning Telemetry
 * Tracing for multi-step AI planning, objective coordination, and execution simulations.
 */

import { recordAutonomousEvent } from "./autonomous-telemetry";

export interface DistributedPlanningTrace {
  planId: string;
  tenantId: string;
  phase: "planning" | "adaptation" | "simulation" | "coordination";
  stepCount: number;
  confidence: number;
  durationMs: number;
  details: Record<string, any>;
  timestamp: string;
}

const planningTraces: DistributedPlanningTrace[] = [];

export function traceDistributedPlanning(trace: Omit<DistributedPlanningTrace, "timestamp">): void {
  const full: DistributedPlanningTrace = { ...trace, timestamp: new Date().toISOString() };
  planningTraces.push(full);

  recordAutonomousEvent(trace.tenantId, "ai-planning", `planning_${trace.phase}`, {
    planId: trace.planId,
    confidence: trace.confidence,
  });
}

export function getDistributedPlanningTraces(
  tenantId?: string,
  limit = 50,
): DistributedPlanningTrace[] {
  return (tenantId ? planningTraces.filter((t) => t.tenantId === tenantId) : planningTraces).slice(
    -limit,
  );
}
