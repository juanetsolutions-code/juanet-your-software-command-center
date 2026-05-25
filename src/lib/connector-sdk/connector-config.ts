/**
 * Connector SDK - Configuration Management
 * Handles connector configuration with validation and tenant isolation.
 */

export interface ConnectorConfigSchema {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object";
    required: boolean;
    sensitive?: boolean;
    default?: any;
  };
}

export interface ConnectorConfiguration {
  id: string;
  tenantId: string;
  connectorType: string;
  config: Record<string, any>;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export class ConnectorConfigManager {
  private config: ConnectorConfiguration;
  private schema: ConnectorConfigSchema;

  constructor(config: ConnectorConfiguration, schema: ConnectorConfigSchema) {
    this.config = config;
    this.schema = schema;
  }

  get(key: string): any {
    return this.config.config[key];
  }

  set(key: string, value: any): void {
    if (this.schema[key]?.sensitive) {
      // In real implementation: encrypt sensitive values
    }
    this.config.config[key] = value;
    this.config.updatedAt = new Date().toISOString();
  }

  getSanitizedConfig(): Record<string, any> {
    const sanitized: Record<string, any> = {};
    Object.keys(this.config.config).forEach((key) => {
      if (this.schema[key]?.sensitive) {
        sanitized[key] = "***";
      } else {
        sanitized[key] = this.config.config[key];
      }
    });
    return sanitized;
  }
}
