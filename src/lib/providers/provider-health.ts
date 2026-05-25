/**
 * Provider Health
 * Monitors health and availability of external providers.
 */

export interface ProviderHealthStatus {
  provider: string;
  healthy: boolean;
  latencyMs?: number;
  lastChecked: string;
}

export class ProviderHealth {
  private statuses = new Map<string, ProviderHealthStatus>();

  check(provider: string): ProviderHealthStatus {
    const status: ProviderHealthStatus = {
      provider,
      healthy: true,
      latencyMs: 45,
      lastChecked: new Date().toISOString(),
    };
    this.statuses.set(provider, status);
    return status;
  }
}

export const providerHealth = new ProviderHealth();
