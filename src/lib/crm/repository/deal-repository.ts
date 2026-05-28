import type { Deal, CrmFilter } from "../core/crm-entities";

type DealQueryParams = {
  tenantId: string;
  filter?: CrmFilter;
  limit?: number;
  offset?: number;
};

type DealQueryResult = {
  deals: Deal[];
  total: number;
  hasMore: boolean;
};

export class DealRepository {
  private deals: Map<string, Deal> = new Map();

  async create(data: Omit<Deal, "id" | "createdAt" | "updatedAt">): Promise<Deal> {
    const deal: Deal = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deals.set(deal.id, deal);
    return deal;
  }

  async findById(id: string, tenantId: string): Promise<Deal | undefined> {
    const deal = this.deals.get(id);
    if (!deal || deal.tenantId !== tenantId) return undefined;
    return deal;
  }

  async query(params: DealQueryParams): Promise<DealQueryResult> {
    let results = Array.from(this.deals.values()).filter((d) => d.tenantId === params.tenantId);

    if (params.filter) {
      results = this.applyFilter(results, params.filter);
    }

    const total = results.length;
    const limit = params.limit ?? 50;
    const offset = params.offset ?? 0;
    
    results = results.slice(offset, offset + limit);

    return {
      deals: results,
      total,
      hasMore: offset + limit < total,
    };
  }

  async update(id: string, tenantId: string, updates: Partial<Deal>): Promise<Deal | undefined> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return undefined;

    const updated: Deal = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.deals.set(id, updated);
    return updated;
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const deal = await this.findById(id, tenantId);
    if (!deal) return false;
    return this.deals.delete(id);
  }

  async countByStage(tenantId: string, pipelineId?: string): Promise<Record<string, number>> {
    let deals = Array.from(this.deals.values()).filter((d) => d.tenantId === tenantId);
    if (pipelineId) {
      deals = deals.filter((d) => d.pipelineId === pipelineId);
    }
    
    const counts: Record<string, number> = {};
    for (const deal of deals) {
      counts[deal.stage] = (counts[deal.stage] ?? 0) + 1;
    }
    return counts;
  }

  async forecastRevenue(tenantId: string, pipelineId?: string): Promise<number> {
    let deals = Array.from(this.deals.values()).filter((d) => d.tenantId === tenantId);
    if (pipelineId) {
      deals = deals.filter((d) => d.pipelineId === pipelineId);
    }
    
    deals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");
    
    return deals.reduce((sum, deal) => {
      const probability = deal.probability ?? 0;
      return sum + (deal.value * probability / 100);
    }, 0);
  }

  private applyFilter(deals: Deal[], filter: CrmFilter): Deal[] {
    return deals.filter((deal) => {
      if (filter.stage && deal.stage !== filter.stage) return false;
      if (filter.assignedTo && deal.assignedTo !== filter.assignedTo) return false;
      if (filter.pipelineId && deal.pipelineId !== filter.pipelineId) return false;
      return true;
    });
  }

  private generateId(): string {
    return `deal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}