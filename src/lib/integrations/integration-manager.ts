/**
 * Enterprise Integration Core - Integration Manager
 * High-level manager responsible for the full lifecycle of integrations across tenants.
 * Coordinates registry, runtime, health, and lifecycle components.
 */

import * as Registry from "./integration-registry";
import { integrationRuntime } from "./integration-runtime";
import type { IntegrationConfig, IntegrationInstance } from "./integration-types";

export class IntegrationManager {
  async registerIntegration(config: IntegrationConfig): Promise<string> {
    Registry.registerIntegration(config as any);
    const id = config.type;
    return id;
  }

  async startIntegration(integrationId: string, tenantId: string): Promise<IntegrationInstance> {
    const config = (
      Registry.getIntegration ? Registry.getIntegration(integrationId as any) : undefined
    ) as IntegrationConfig | undefined;
    if (!config) throw new Error("Integration not found or access denied");

    return integrationRuntime.startIntegration({
      ...config,
      tenantId,
    } as any);
  }

  async stopIntegration(instanceId: string, tenantId: string): Promise<void> {
    const instance = integrationRuntime
      .getActiveIntegrations(tenantId)
      .find((i) => i.id === instanceId);

    if (!instance) throw new Error("Integration instance not found");

    await integrationRuntime.stopIntegration(instanceId);
  }

  async getIntegrationHealth(integrationId: string, tenantId: string) {
    // In real implementation would aggregate from integration-health
    return { status: "healthy", lastChecked: new Date().toISOString() };
  }

  async listIntegrations(tenantId: string) {
    return Registry.listIntegrationsForTenant
      ? Registry.listIntegrationsForTenant(tenantId)
      : Registry.listIntegrations
        ? Registry.listIntegrations()
        : [];
  }
}

export const integrationManager = new IntegrationManager();
