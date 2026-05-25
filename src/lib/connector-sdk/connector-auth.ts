/**
 * Connector SDK - Authentication Abstraction
 * Provides standardized authentication mechanisms for all connectors.
 */

export type AuthType = "oauth2" | "api_key" | "basic" | "jwt" | "custom";

export interface ConnectorAuthConfig {
  type: AuthType;
  credentials: Record<string, any>;
  tokenUrl?: string;
  scopes?: string[];
  refreshToken?: string;
}

export abstract class BaseConnectorAuth {
  protected config: ConnectorAuthConfig;

  constructor(config: ConnectorAuthConfig) {
    this.config = config;
  }

  abstract authenticate(): Promise<Record<string, any>>;
  abstract refreshToken?(): Promise<Record<string, any>>;
  abstract isTokenValid(): boolean;

  getAuthType(): AuthType {
    return this.config.type;
  }
}
