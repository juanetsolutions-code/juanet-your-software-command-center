/**
 * Provider Observability
 * Telemetry and tracing for all provider interactions.
 */

export interface ProviderCall {
  provider: string;
  operation: string;
  tenantId: string;
  durationMs: number;
  success: boolean;
}

export class ProviderObservability {
  private calls: ProviderCall[] = [];

  record(call: ProviderCall): void {
    this.calls.push(call);
    if (this.calls.length > 1000) this.calls.shift();
  }

  getRecent(tenantId?: string): ProviderCall[] {
    return tenantId ? this.calls.filter((c) => c.tenantId === tenantId) : this.calls;
  }
}

export const providerObservability = new ProviderObservability();
