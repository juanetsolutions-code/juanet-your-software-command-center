import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export class CrmCacheLayer {
  private leadCache: Map<string, { data: Lead; expires: number }> = new Map();
  private dealCache: Map<string, { data: Deal; expires: number }> = new Map();
  private ttl = 5 * 60 * 1000; // 5 minutes

  setLead(lead: Lead): void {
    this.leadCache.set(lead.id, {
      data: lead,
      expires: Date.now() + this.ttl,
    });
  }

  getLead(leadId: string): Lead | undefined {
    const cached = this.leadCache.get(leadId);
    if (!cached) return undefined;

    if (cached.expires < Date.now()) {
      this.leadCache.delete(leadId);
      return undefined;
    }

    return cached.data;
  }

  setDeal(deal: Deal): void {
    this.dealCache.set(deal.id, {
      data: deal,
      expires: Date.now() + this.ttl,
    });
  }

  getDeal(dealId: string): Deal | undefined {
    const cached = this.dealCache.get(dealId);
    if (!cached) return undefined;

    if (cached.expires < Date.now()) {
      this.dealCache.delete(dealId);
      return undefined;
    }

    return cached.data;
  }

  invalidateTenant(tenantId: string): void {
    Array.from(this.leadCache.entries())
      .filter(([_, { data }]) => data.tenantId === tenantId)
      .forEach(([key]) => this.leadCache.delete(key));

    Array.from(this.dealCache.entries())
      .filter(([_, { data }]) => data.tenantId === tenantId)
      .forEach(([key]) => this.dealCache.delete(key));
  }
}