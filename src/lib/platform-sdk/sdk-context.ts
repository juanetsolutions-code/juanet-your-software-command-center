export interface SDKContext {
  tenantId: string;
  userId?: string;
  environment: "development" | "staging" | "production";
  features?: Record<string, boolean>;
}

export function buildSDKContext(partial: Partial<SDKContext> & { tenantId: string }): SDKContext {
  return {
    environment: "production",
    ...partial,
  };
}
