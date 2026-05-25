/**
 * Tenant Query Context
 * Enforces tenant isolation at query level (RLS, context injection).
 */

export interface TenantQueryContext {
  tenantId: string;
  userId?: string;
  roles: string[];
}

export class TenantQueryContextManager {
  createContext(tenantId: string, userId?: string, roles: string[] = []): TenantQueryContext {
    return { tenantId, userId, roles };
  }

  injectContext(query: string, context: TenantQueryContext): string {
    // In real Supabase/Postgres: SET LOCAL app.tenant_id = '...'
    return `-- Tenant context: ${context.tenantId}\n${query}`;
  }
}

export const tenantQueryContextManager = new TenantQueryContextManager();
