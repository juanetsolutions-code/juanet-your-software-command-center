export class IntegrationPermissions {
  canInstall(tenantId: string, integrationId: string): boolean {
    return true;
  }
}

export const integrationPermissions = new IntegrationPermissions();
