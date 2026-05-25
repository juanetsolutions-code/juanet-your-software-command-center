/**
 * Attack Surface Reducer
 * Reduces exposed attack surface through strict allow-lists, header hardening, and endpoint restrictions.
 */

export interface AttackSurfaceConfig {
  allowedMethods: string[];
  requiredHeaders: string[];
  maxRequestSize: number;
}

export class AttackSurfaceReducer {
  getConfig(): AttackSurfaceConfig {
    return {
      allowedMethods: ["GET", "POST", "PUT", "DELETE"],
      requiredHeaders: ["x-tenant-id", "authorization"],
      maxRequestSize: 10 * 1024 * 1024, // 10MB
    };
  }

  isRequestAllowed(method: string, headers: Record<string, string>): boolean {
    const config = this.getConfig();
    return (
      config.allowedMethods.includes(method) && config.requiredHeaders.every((h) => !!headers[h])
    );
  }
}

export const attackSurfaceReducer = new AttackSurfaceReducer();
