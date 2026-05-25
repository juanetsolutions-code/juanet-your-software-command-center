/**
 * Predictive Analytics Instrumentation
 * Metrics and traces for forecasting, simulation, risk modeling, and growth projections.
 */

import { recordAutonomousEvent } from "./autonomous-telemetry";

export interface PredictiveAnalyticsEvent {
  id: string;
  tenantId: string;
  type: "scaling_forecast" | "cost_forecast" | "risk_simulation" | "tenant_growth" | "traffic_sim";
  predictedValue: number;
  confidence: number;
  horizon: string;
  metadata: Record<string, any>;
  timestamp: string;
}

const predictiveEvents: PredictiveAnalyticsEvent[] = [];

export function recordPredictiveAnalytics(
  tenantId: string,
  type: PredictiveAnalyticsEvent["type"],
  predictedValue: number,
  confidence: number,
  horizon: string,
  metadata: Record<string, any> = {},
): void {
  const event: PredictiveAnalyticsEvent = {
    id: `pred-${Date.now()}`,
    tenantId,
    type,
    predictedValue,
    confidence,
    horizon,
    metadata,
    timestamp: new Date().toISOString(),
  };
  predictiveEvents.push(event);

  recordAutonomousEvent(tenantId, "autonomous-ops", `predictive_${type}`, {
    predictedValue,
    confidence,
  });
}

export function getPredictiveAnalyticsEvents(
  tenantId?: string,
  limit = 100,
): PredictiveAnalyticsEvent[] {
  let res = predictiveEvents;
  if (tenantId) res = res.filter((e) => e.tenantId === tenantId);
  return res.slice(-limit);
}
