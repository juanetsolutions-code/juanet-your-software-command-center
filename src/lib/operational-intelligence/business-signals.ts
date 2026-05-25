/**
 * Business Signals
 * Aggregates and normalizes business-level signals for intelligence layers.
 */

export interface BusinessSignal {
  tenantId: string;
  signalType: "revenue" | "adoption" | "risk" | "growth" | "efficiency";
  value: number;
  context: Record<string, any>;
  timestamp: string;
}

export class BusinessSignals {
  private signals: BusinessSignal[] = [];

  ingest(
    tenantId: string,
    type: BusinessSignal["signalType"],
    value: number,
    context: Record<string, any> = {},
  ): BusinessSignal {
    const sig: BusinessSignal = {
      tenantId,
      signalType: type,
      value,
      context,
      timestamp: new Date().toISOString(),
    };
    this.signals.push(sig);
    return sig;
  }
}

export const businessSignals = new BusinessSignals();
