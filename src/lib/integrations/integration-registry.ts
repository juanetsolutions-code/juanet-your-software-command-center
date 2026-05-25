/**
 * Integration Registry - Central registry for external integrations.
 */

export type IntegrationType =
  | "slack"
  | "discord"
  | "google_workspace"
  | "github"
  | "stripe"
  | "zapier";

export interface IntegrationRegistryConfig {
  type: IntegrationType;
  enabled: boolean;
  credentials?: Record<string, string>;
}

const integrations = new Map<IntegrationType, IntegrationRegistryConfig>();

export function registerIntegration(config: IntegrationRegistryConfig) {
  integrations.set(config.type, config);
}

export function getIntegration(type: IntegrationType) {
  return integrations.get(type);
}

export function listIntegrations() {
  return Array.from(integrations.values());
}

// Backward-compatible helpers (do not export duplicate type names)
export function listIntegrationsForTenant(_tenantId: string) {
  // simple platform-level listing for now; tenant-filtering can be added
  return listIntegrations();
}
