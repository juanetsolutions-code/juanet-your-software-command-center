/**
 * AI Context Orchestration Layer - Tenant Context
 * Tenant-specific context building and caching.
 */

export class TenantContext {
  private cache: Map<string, any> = new Map();

  get(tenantId: string): any {
    return this.cache.get(tenantId) || {};
  }

  set(tenantId: string, context: any): void {
    this.cache.set(tenantId, { ...context, updatedAt: new Date().toISOString() });
  }
}

export const tenantContext = new TenantContext();
