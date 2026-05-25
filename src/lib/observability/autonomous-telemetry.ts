/**
 * Autonomous Telemetry
 * Core instrumentation for autonomous operations, self-healing, and AI decision systems.
 * Extends existing observability without modifying prior behavior.
 */

import { recordMetric } from "./metrics";

export interface AutonomousTelemetryEvent {
  id: string;
  tenantId: string;
  layer:
    | "autonomous-ops"
    | "self-healing"
    | "ai-planning"
    | "resource-opt"
    | "security"
    | "success";
  eventType: string;
  data: Record<string, any>;
  timestamp: string;
}

const autonomousEvents: AutonomousTelemetryEvent[] = [];

export function recordAutonomousEvent(
  tenantId: string,
  layer: AutonomousTelemetryEvent["layer"],
  eventType: string,
  data: Record<string, any> = {},
): void {
  const event: AutonomousTelemetryEvent = {
    id: `auto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    tenantId,
    layer,
    eventType,
    data,
    timestamp: new Date().toISOString(),
  };
  autonomousEvents.push(event);

  // Also feed into core metrics for unified view
  recordMetric(`autonomous.${layer}.${eventType}`, 1, "count", { tenantId });

  // Cap in-memory store
  if (autonomousEvents.length > 1000) autonomousEvents.shift();
}

export function getAutonomousTelemetry(
  tenantId?: string,
  layer?: string,
  limit = 100,
): AutonomousTelemetryEvent[] {
  let filtered = autonomousEvents;
  if (tenantId) filtered = filtered.filter((e) => e.tenantId === tenantId);
  if (layer) filtered = filtered.filter((e) => e.layer === layer);
  return filtered.slice(-limit);
}

export function clearAutonomousTelemetry(): void {
  autonomousEvents.length = 0;
}
