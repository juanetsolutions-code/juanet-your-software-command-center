/**
 * Feature Flags
 * Tenant-aware feature flag system for controlled rollouts and experimentation.
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  tenantId?: string;
  rolloutPercentage?: number;
  conditions?: Record<string, any>;
}

export class FeatureFlags {
  private flags: FeatureFlag[] = [];

  isEnabled(key: string, tenantId: string): boolean {
    const flag = this.flags.find((f) => f.key === key && (!f.tenantId || f.tenantId === tenantId));
    if (!flag) return false;
    if (flag.rolloutPercentage !== undefined) {
      // Simple hash-based rollout for determinism
      const hash = (tenantId + key).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      return hash % 100 < flag.rolloutPercentage;
    }
    return flag.enabled;
  }

  setFlag(flag: FeatureFlag): void {
    const idx = this.flags.findIndex((f) => f.key === flag.key && f.tenantId === flag.tenantId);
    if (idx >= 0) this.flags[idx] = flag;
    else this.flags.push(flag);
  }
}

export const featureFlags = new FeatureFlags();
