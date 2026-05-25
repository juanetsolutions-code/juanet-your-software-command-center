/**
 * Adaptive Sync
 * Dynamically adjusts sync frequency and strategy based on data volatility and tenant load.
 */

export interface AdaptiveSyncConfig {
  tenantId: string;
  currentFrequency: number;
  strategy: "aggressive" | "balanced" | "conservative";
}

export class AdaptiveSync {
  adjust(tenantId: string, volatility: number): AdaptiveSyncConfig {
    const strategy =
      volatility > 0.7 ? "aggressive" : volatility > 0.4 ? "balanced" : "conservative";
    return {
      tenantId,
      currentFrequency: strategy === "aggressive" ? 60 : 300,
      strategy,
    };
  }
}

export const adaptiveSync = new AdaptiveSync();
