/**
 * Config Versioning
 * Maintains full version history of all configuration changes.
 */

export interface ConfigVersion {
  key: string;
  version: number;
  value: any;
  changedBy: string;
  changedAt: string;
}

export class ConfigVersioning {
  private versions: ConfigVersion[] = [];

  recordChange(key: string, value: any, changedBy: string, version: number): ConfigVersion {
    const entry: ConfigVersion = {
      key,
      version,
      value,
      changedBy,
      changedAt: new Date().toISOString(),
    };
    this.versions.push(entry);
    return entry;
  }
}

export const configVersioning = new ConfigVersioning();
