export type QuotaCheck = {
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
  resetAt?: string;
};

export type QuotaResource = {
  name: string;
  limit: number;
  windowSeconds?: number;
};

class QuotaChecker {
  private quotas: Map<string, Map<string, QuotaResource>> = new Map();
  private usage: Map<string, Map<string, { used: number; resetAt: number }>> = new Map();

  defineQuota(tenantId: string, resource: string, limit: number, windowSeconds?: number): void {
    if (!this.quotas.has(tenantId)) {
      this.quotas.set(tenantId, new Map());
    }
    this.quotas.get(tenantId)!.set(resource, { limit, windowSeconds });

    if (!this.usage.has(tenantId)) {
      this.usage.set(tenantId, new Map());
    }
  }

  increment(tenantId: string, resource: string, amount = 1): QuotaCheck {
    const quotas = this.quotas.get(tenantId);
    const resourceQuota = quotas?.get(resource);

    if (!resourceQuota) {
      return { allowed: true, limit: Infinity, used: 0, remaining: Infinity };
    }

    let usageRecord = this.usage.get(tenantId)!.get(resource);
    const now = Date.now();

    if (resourceQuota.windowSeconds && (!usageRecord || now > usageRecord.resetAt)) {
      usageRecord = { used: 0, resetAt: now + resourceQuota.windowSeconds * 1000 };
    }

    usageRecord!.used += amount;
    this.usage.get(tenantId)!.set(resource, usageRecord!);

    const remaining = resourceQuota.limit - usageRecord!.used;

    return {
      allowed: usageRecord!.used <= resourceQuota.limit,
      limit: resourceQuota.limit,
      used: usageRecord!.used,
      remaining,
      resetAt: new Date(usageRecord!.resetAt).toISOString(),
    };
  }

  check(tenantId: string, resource: string): QuotaCheck {
    const quotas = this.quotas.get(tenantId);
    const resourceQuota = quotas?.get(resource);

    if (!resourceQuota) {
      return { allowed: true, limit: Infinity, used: 0, remaining: Infinity };
    }

    const usageRecord = this.usage.get(tenantId)?.get(resource);
    const used = usageRecord?.used ?? 0;
    const remaining = resourceQuota.limit - used;

    return {
      allowed: used <= resourceQuota.limit,
      limit: resourceQuota.limit,
      used,
      remaining,
      resetAt: usageRecord ? new Date(usageRecord.resetAt).toISOString() : undefined,
    };
  }

  reset(tenantId: string, resource?: string): void {
    if (resource) {
      this.usage.get(tenantId)?.delete(resource);
    } else {
      this.usage.delete(tenantId);
    }
  }
}

export const quotaChecker = new QuotaChecker();

export function checkQuota(tenantId: string, resource: string, amount?: number): QuotaCheck {
  if (amount) {
    return quotaChecker.increment(tenantId, resource, amount);
  }
  return quotaChecker.check(tenantId, resource);
}

export function defineTenantQuota(
  tenantId: string,
  resource: string,
  limit: number,
  windowSeconds?: number
): void {
  quotaChecker.defineQuota(tenantId, resource, limit, windowSeconds);
}