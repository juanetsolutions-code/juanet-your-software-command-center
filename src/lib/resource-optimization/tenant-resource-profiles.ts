/**
 * Tenant Resource Profiles
 * Per-tenant resource characteristics and optimization policies.
 */

export interface TenantResourceProfile {
  tenantId: string;
  tier: "starter" | "growth" | "enterprise";
  baselineCpu: number;
  baselineMemory: number;
  peakMultiplier: number;
  costSensitivity: number;
  performancePriority: number;
  lastUpdated: string;
}

export class TenantResourceProfiles {
  private profiles = new Map<string, TenantResourceProfile>();

  getOrCreate(
    tenantId: string,
    tier: TenantResourceProfile["tier"] = "growth",
  ): TenantResourceProfile {
    if (!this.profiles.has(tenantId)) {
      this.profiles.set(tenantId, {
        tenantId,
        tier,
        baselineCpu: tier === "enterprise" ? 4 : 1,
        baselineMemory: tier === "enterprise" ? 8192 : 2048,
        peakMultiplier: tier === "enterprise" ? 2.5 : 1.6,
        costSensitivity: tier === "starter" ? 0.9 : 0.5,
        performancePriority: tier === "enterprise" ? 0.9 : 0.6,
        lastUpdated: new Date().toISOString(),
      });
    }
    return this.profiles.get(tenantId)!;
  }

  updateProfile(tenantId: string, updates: Partial<TenantResourceProfile>): void {
    const p = this.getOrCreate(tenantId);
    Object.assign(p, updates, { lastUpdated: new Date().toISOString() });
  }
}

export const tenantResourceProfiles = new TenantResourceProfiles();
