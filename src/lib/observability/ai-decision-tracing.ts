/**
 * AI Decision Tracing
 * Detailed tracing for AI planning, decisions, and execution simulations.
 */

import { recordAutonomousEvent } from "./autonomous-telemetry";

export interface AIDecisionTrace {
  decisionId: string;
  tenantId: string;
  planId?: string;
  reasoning: string[];
  confidence: number;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  timestamp: string;
}

const decisionTraces: AIDecisionTrace[] = [];

export function traceAIDecision(trace: Omit<AIDecisionTrace, "timestamp">): void {
  const full: AIDecisionTrace = { ...trace, timestamp: new Date().toISOString() };
  decisionTraces.push(full);
  recordAutonomousEvent(trace.tenantId, "ai-planning", "decision_traced", {
    decisionId: trace.decisionId,
    confidence: trace.confidence,
  });
}

export function getAIDecisionTraces(tenantId?: string, limit = 50): AIDecisionTrace[] {
  let res = decisionTraces;
  if (tenantId) res = res.filter((t) => t.tenantId === tenantId);
  return res.slice(-limit);
}
