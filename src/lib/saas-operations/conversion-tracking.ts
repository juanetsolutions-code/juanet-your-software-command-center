/**
 * Conversion Tracking
 * Tracks commercial conversion events and funnel metrics.
 */

export interface ConversionEvent {
  tenantId: string;
  fromStage: string;
  toStage: string;
  value?: number;
  timestamp: string;
}

export class ConversionTracking {
  private events: ConversionEvent[] = [];

  track(tenantId: string, from: string, to: string, value?: number): ConversionEvent {
    const evt: ConversionEvent = {
      tenantId,
      fromStage: from,
      toStage: to,
      value,
      timestamp: new Date().toISOString(),
    };
    this.events.push(evt);
    return evt;
  }
}

export const conversionTracking = new ConversionTracking();
