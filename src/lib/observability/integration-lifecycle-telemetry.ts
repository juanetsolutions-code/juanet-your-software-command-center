/**
 * Integration Lifecycle Telemetry
 * Full lifecycle visibility for all integrations and sync activities.
 */

export interface IntegrationLifecycleEvent {
  id: string;
  tenantId: string;
  provider: string;
  event: "connected" | "sync_started" | "sync_completed" | "failed";
  details: Record<string, any>;
  timestamp: string;
}

export class IntegrationLifecycleTelemetry {
  private events: IntegrationLifecycleEvent[] = [];

  record(
    tenantId: string,
    provider: string,
    event: IntegrationLifecycleEvent["event"],
    details: Record<string, any> = {},
  ): IntegrationLifecycleEvent {
    const e: IntegrationLifecycleEvent = {
      id: `int-lc-${Date.now()}`,
      tenantId,
      provider,
      event,
      details,
      timestamp: new Date().toISOString(),
    };
    this.events.push(e);
    return e;
  }
}

export const integrationLifecycleTelemetry = new IntegrationLifecycleTelemetry();
