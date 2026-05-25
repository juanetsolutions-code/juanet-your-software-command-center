/**
 * Tenant Metrics
 * Tenant-specific metric computation and storage.
 */

export interface TenantMetric {
  tenantId: string;
  name: string;
  value: number;
  period: string;
}

export class TenantMetrics {
  private metrics: TenantMetric[] = [];

  record(tenantId: string, name: string, value: number): TenantMetric {
    const m: TenantMetric = {
      tenantId,
      name,
      value,
      period: new Date().toISOString().slice(0, 10),
    };
    this.metrics.push(m);
    return m;
  }
}

export const tenantMetrics = new TenantMetrics();
