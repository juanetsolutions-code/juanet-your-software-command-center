/**
 * Configuration Governance System - Config Registry
 * Centralized registry of all system and tenant configurations.
 */

export interface ConfigEntry {
  key: string;
  value: any;
  tenantId?: string;
  version: number;
  updatedAt: string;
}

export class ConfigRegistry {
  private configs: ConfigEntry[] = [];

  set(key: string, value: any, tenantId?: string): ConfigEntry {
    const existing = this.configs.findIndex((c) => c.key === key && c.tenantId === tenantId);
    const entry: ConfigEntry = {
      key,
      value,
      tenantId,
      version: existing >= 0 ? this.configs[existing].version + 1 : 1,
      updatedAt: new Date().toISOString(),
    };
    if (existing >= 0) this.configs[existing] = entry;
    else this.configs.push(entry);
    return entry;
  }

  get(key: string, tenantId?: string): any {
    const entry = this.configs.find((c) => c.key === key && c.tenantId === tenantId);
    return entry?.value;
  }
}

export const configRegistry = new ConfigRegistry();
