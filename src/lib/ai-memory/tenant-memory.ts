/**
 * AI Memory Infrastructure - Tenant Memory
 * Tenant isolation and association layer for all memory operations.
 */

export class TenantMemory {
  private tenantIndex: Map<string, Set<string>> = new Map();

  async associate(tenantId: string, memoryId: string): Promise<void> {
    if (!this.tenantIndex.has(tenantId)) {
      this.tenantIndex.set(tenantId, new Set());
    }
    this.tenantIndex.get(tenantId)!.add(memoryId);
  }

  async getForTenant(tenantId: string): Promise<string[]> {
    return Array.from(this.tenantIndex.get(tenantId) || []);
  }

  async removeAssociation(tenantId: string, memoryId: string): Promise<void> {
    this.tenantIndex.get(tenantId)?.delete(memoryId);
  }
}

export const tenantMemory = new TenantMemory();
