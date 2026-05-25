/**
 * Integration Auth
 * Handles credential storage, rotation, and scoped access for integrations.
 */

export interface IntegrationCredential {
  tenantId: string;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export class IntegrationAuth {
  private creds = new Map<string, IntegrationCredential>();

  store(cred: IntegrationCredential): void {
    const key = `${cred.tenantId}:${cred.provider}`;
    this.creds.set(key, cred);
  }

  get(tenantId: string, provider: string): IntegrationCredential | undefined {
    return this.creds.get(`${tenantId}:${provider}`);
  }
}

export const integrationAuth = new IntegrationAuth();
