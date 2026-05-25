/**
 * Integration Types.
 */

export interface Integration {
  id: string;
  tenantId: string;
  type: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface IntegrationConfig {
  id: string;
  tenantId: string;
  type: string;
  settings: Record<string, any>;
}

export interface IntegrationInstance {
  id: string;
  tenantId: string;
  connectorType: string;
  status: "running" | "stopped" | "error";
  startedAt: string;
  config?: IntegrationConfig;
}

export interface IntegrationResult {
  success: boolean;
  instanceId?: string;
  tenantId?: string;
  recordsProcessed?: number;
  completedAt?: string;
}
