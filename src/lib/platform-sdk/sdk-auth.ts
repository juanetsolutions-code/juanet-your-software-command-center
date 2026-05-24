export interface SDKAuthToken {
  token: string;
  tenantId: string;
  expiresAt: number;
  scopes: string[];
}

export function isTokenValid(t: SDKAuthToken): boolean {
  return t.expiresAt > Date.now();
}

export function hasScope(t: SDKAuthToken, scope: string): boolean {
  return t.scopes.includes(scope) || t.scopes.includes("*");
}
