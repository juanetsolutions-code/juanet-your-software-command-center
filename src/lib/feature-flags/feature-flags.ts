/**
 * Feature Flags - Tenant-aware feature management
 */

export type FeatureFlag =
  | "ai_assistant"
  | "advanced_analytics"
  | "realtime_chat"
  | "multi_currency"
  | "custom_branding"
  | "api_access"
  | "beta_features";

export interface FeatureFlagConfig {
  key: FeatureFlag;
  enabled: boolean;
  rolloutPercentage?: number;
  tenants?: string[];
}

const featureFlags: Map<string, FeatureFlagConfig> = new Map(
  [
    { key: "ai_assistant", enabled: true, rolloutPercentage: 100 },
    { key: "advanced_analytics", enabled: true, rolloutPercentage: 75 },
    { key: "realtime_chat", enabled: true, rolloutPercentage: 50 },
    { key: "multi_currency", enabled: false, rolloutPercentage: 0 },
    { key: "custom_branding", enabled: false, rolloutPercentage: 0 },
    { key: "api_access", enabled: true, rolloutPercentage: 100 },
    { key: "beta_features", enabled: false, rolloutPercentage: 0 },
  ].map((f) => [f.key, f]),
);

export function isFeatureEnabled(feature: FeatureFlag, tenantId?: string): boolean {
  const config = featureFlags.get(feature);
  if (!config) return false;

  if (config.tenants?.length && tenantId) {
    return config.tenants.includes(tenantId);
  }

  if (config.rolloutPercentage && config.rolloutPercentage < 100) {
    const hash = tenantId
      ? tenantId.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
      : Math.random();
    const bucket = hash % 100;
    return bucket < config.rolloutPercentage;
  }

  return config.enabled;
}

export function setFeatureFlag(feature: FeatureFlag, enabled: boolean): void {
  const config = featureFlags.get(feature);
  if (config) {
    config.enabled = enabled;
  }
}

export function listFeatureFlags(): FeatureFlagConfig[] {
  return [...featureFlags.values()];
}

export function getFeatureFlag(feature: FeatureFlag): FeatureFlagConfig | undefined {
  return featureFlags.get(feature);
}
