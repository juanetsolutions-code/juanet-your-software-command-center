/**
 * SSO Foundation (SAML/OIDC prep)
 * Architecture for enterprise single sign-on.
 */

export interface SSOConfig {
  tenantId: string;
  provider: "saml" | "oidc";
  metadataUrl?: string;
  clientId?: string;
  enabled: boolean;
}

const ssoConfigs = new Map<string, SSOConfig>();

export function configureSSO(config: SSOConfig) {
  ssoConfigs.set(config.tenantId, config);
}

export function getSSOConfig(tenantId: string): SSOConfig | undefined {
  return ssoConfigs.get(tenantId);
}
