// Minimal in-memory mock deal service for UI compatibility.
import type { Deal } from "../core/crm-entities";
import type { DealStage } from "../core/crm-types";

export type DealCreateParams = Omit<Deal, "id" | "createdAt" | "updatedAt">;
export type DealUpdateParams = Partial<Omit<Deal, "id" | "tenantId" | "createdAt" | "updatedAt">>;

export class DealService {
  private deals = new Map<string, Deal>();

  async create(params: DealCreateParams, tenantId: string): Promise<Deal> {
    const id = `deal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const deal = { ...params, id, tenantId, createdAt: now, updatedAt: now } as Deal;
    this.deals.set(id, deal);
    return deal;
  }

  async update(
    dealId: string,
    updates: DealUpdateParams,
    _tenantId: string,
  ): Promise<Deal | undefined> {
    const existing = this.deals.get(dealId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() } as Deal;
    this.deals.set(dealId, updated);
    return updated;
  }

  async getById(dealId: string, _tenantId: string): Promise<Deal | undefined> {
    return this.deals.get(dealId);
  }

  async list(tenantId: string, stage?: DealStage): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(
      (d) => d.tenantId === tenantId && (!stage || d.stage === stage),
    );
  }

  async forecastRevenue(tenantId: string): Promise<number> {
    return (await this.list(tenantId)).reduce((s, d) => s + (d.value ?? 0), 0);
  }
}

export const dealService = new DealService();
