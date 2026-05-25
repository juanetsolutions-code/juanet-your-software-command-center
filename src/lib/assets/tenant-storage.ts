/**
 * Tenant Storage
 * Quota and isolation management per tenant storage.
 */

export interface TenantStorageQuota {
  tenantId: string;
  usedBytes: number;
  limitBytes: number;
}

export class TenantStorage {
  private quotas = new Map<string, TenantStorageQuota>();

  getQuota(tenantId: string): TenantStorageQuota {
    if (!this.quotas.has(tenantId)) {
      this.quotas.set(tenantId, { tenantId, usedBytes: 0, limitBytes: 10 * 1024 * 1024 * 1024 });
    }
    return this.quotas.get(tenantId)!;
  }

  recordUpload(tenantId: string, bytes: number): void {
    const q = this.getQuota(tenantId);
    q.usedBytes += bytes;
  }
}

export const tenantStorage = new TenantStorage();
