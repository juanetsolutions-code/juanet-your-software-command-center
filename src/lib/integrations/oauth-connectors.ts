/**
 * OAuth Connectors
 * Production-ready OAuth2 / OpenID Connect connector abstractions.
 */

export interface OAuthConnector {
  provider: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
}

export const oauthConnectors: OAuthConnector[] = [
  {
    provider: "google",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["openid", "email"],
  },
  {
    provider: "github",
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scopes: ["user:email"],
  },
];

export class OAuthConnectorRegistry {
  get(provider: string): OAuthConnector | undefined {
    return oauthConnectors.find((c) => c.provider === provider);
  }
}

export const oauthConnectorRegistry = new OAuthConnectorRegistry();
