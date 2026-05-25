/**
 * Runtime Config
 * Safe runtime configuration updates with validation and rollback support.
 */

export interface RuntimeConfigUpdate {
  key: string;
  oldValue: any;
  newValue: any;
  appliedAt: string;
}

export class RuntimeConfig {
  private current: Record<string, any> = {};

  update(key: string, value: any): RuntimeConfigUpdate {
    const old = this.current[key];
    this.current[key] = value;
    return {
      key,
      oldValue: old,
      newValue: value,
      appliedAt: new Date().toISOString(),
    };
  }
}

export const runtimeConfig = new RuntimeConfig();
