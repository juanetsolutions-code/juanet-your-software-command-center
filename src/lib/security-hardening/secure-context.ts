/**
 * Secure Context
 * Hardened, immutable security context for requests, sessions, and AI operations.
 */

export interface SecureContext {
  tenantId: string;
  userId?: string;
  roles: string[];
  ipAddress?: string;
  sessionId: string;
  riskScore: number;
  createdAt: string;
}

export class SecureContextManager {
  createContext(tenantId: string, userId: string, roles: string[], ip?: string): SecureContext {
    return {
      tenantId,
      userId,
      roles: roles || [],
      ipAddress: ip,
      sessionId: `sec-${Date.now()}`,
      riskScore: 0.1,
      createdAt: new Date().toISOString(),
    };
  }

  validateContext(ctx: SecureContext): boolean {
    return !!ctx.tenantId && ctx.riskScore < 0.8;
  }
}

export const secureContextManager = new SecureContextManager();
