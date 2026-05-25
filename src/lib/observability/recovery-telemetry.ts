/**
 * Recovery Telemetry
 * Instrumentation for self-healing recovery events, audits, and restoration workflows.
 */

import { recordAutonomousEvent } from "./autonomous-telemetry";

export interface RecoveryTelemetryEvent {
  healingEventId: string;
  tenantId: string;
  service: string;
  phase: "detected" | "planned" | "approved" | "executed" | "rolled_back";
  durationMs?: number;
  success: boolean;
  details: Record<string, any>;
  timestamp: string;
}

const recoveryEvents: RecoveryTelemetryEvent[] = [];

export function recordRecoveryTelemetry(event: Omit<RecoveryTelemetryEvent, "timestamp">): void {
  const full: RecoveryTelemetryEvent = { ...event, timestamp: new Date().toISOString() };
  recoveryEvents.push(full);
  recordAutonomousEvent(event.tenantId, "self-healing", `recovery_${event.phase}`, {
    healingEventId: event.healingEventId,
    success: event.success,
  });
}

export function getRecoveryTelemetry(tenantId?: string, limit = 100): RecoveryTelemetryEvent[] {
  return (tenantId ? recoveryEvents.filter((e) => e.tenantId === tenantId) : recoveryEvents).slice(
    -limit,
  );
}
