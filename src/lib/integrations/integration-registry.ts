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

export interface IntegrationConfig {
  type: IntegrationType;
  enabled: boolean;
  credentials?: Record<string, string>;
}

const integrations = new Map<IntegrationType, IntegrationConfig>();

export function registerIntegration(config: IntegrationConfig) {
  integrations.set(config.type, config);
}

export function getIntegration(type: IntegrationType) {
  return integrations.get(type);
}

export function listIntegrations() {
  return Array.from(integrations.values());
}
