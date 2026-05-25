/**
 * Business Event Telemetry
 * Captures and instruments high-level business events for executive visibility.
 */

export interface BusinessEvent {
  id: string;
  tenantId: string;
  eventType: string;
  value: number;
  context: Record<string, any>;
  timestamp: string;
}

export class BusinessEventTelemetry {
  private events: BusinessEvent[] = [];

  record(
    tenantId: string,
    eventType: string,
    value: number,
    context: Record<string, any> = {},
  ): BusinessEvent {
    const evt: BusinessEvent = {
      id: `biz-${Date.now()}`,
      tenantId,
      eventType,
      value,
      context,
      timestamp: new Date().toISOString(),
    };
    this.events.push(evt);
    return evt;
  }
}

export const businessEventTelemetry = new BusinessEventTelemetry();
