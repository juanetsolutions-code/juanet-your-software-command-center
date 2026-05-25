/**
 * Tenant Config
 * Per-tenant configuration management with isolation guarantees.
 */

export interface TenantConfig {
  tenantId: string;
  settings: Record<string, any>;
  lastUpdated: string;
}

export class TenantConfigManager {
  private tenantConfigs = new Map<string, TenantConfig>();

  setTenantConfig(tenantId: string, settings: Record<string, any>): TenantConfig {
    const config: TenantConfig = {
      tenantId,
      settings,
      lastUpdated: new Date().toISOString(),
    };
    this.tenantConfigs.set(tenantId, config);
    return config;
  }

  getTenantConfig(tenantId: string): TenantConfig | undefined {
    return this.tenantConfigs.get(tenantId);
  }
}

export const tenantConfigManager = new TenantConfigManager();
