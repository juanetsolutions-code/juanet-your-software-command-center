/**
 * Tenant Observability Dashboard (Backend)
 * Provides backend data models for tenant-level observability views (no UI).
 */

export interface TenantObservabilityDashboard {
  tenantId: string;
  health: number;
  activeIncidents: number;
  lastError: string;
  keyMetrics: Record<string, number>;
}

export class TenantObservabilityDashboardData {
  generate(tenantId: string): TenantObservabilityDashboard {
    return {
      tenantId,
      health: 0.97,
      activeIncidents: 0,
      lastError: "none",
      keyMetrics: { rps: 1240, errorRate: 0.002 },
    };
  }
}

export const tenantObservabilityDashboardData = new TenantObservabilityDashboardData();
