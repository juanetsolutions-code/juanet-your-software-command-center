/**
 * Connector SDK Foundation - Base Connector
 * Abstract base class that all connectors must extend.
 * Provides standardized lifecycle, error handling, and tenant isolation.
 */

export interface ConnectorConfig {
  id: string;
  tenantId: string;
  type: string;
  credentials: Record<string, any>;
  settings?: Record<string, any>;
}

export abstract class BaseConnector {
  protected config: ConnectorConfig;
  protected isConnected: boolean = false;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract healthCheck(): Promise<boolean>;

  getTenantId(): string {
    return this.config.tenantId;
  }

  getType(): string {
    return this.config.type;
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}
