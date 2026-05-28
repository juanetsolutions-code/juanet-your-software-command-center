import type { Lead, CrmFilter } from "../core/crm-entities";

type LeadQueryParams = {
  tenantId: string;
  filter?: CrmFilter;
  limit?: number;
  offset?: number;
};

type LeadQueryResult = {
  leads: Lead[];
  total: number;
  hasMore: boolean;
};

export class LeadRepository {
  private leads: Map<string, Lead> = new Map();

  async create(data: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
    const lead: Lead = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.set(lead.id, lead);
    return lead;
  }

  async findById(id: string, tenantId: string): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead || lead.tenantId !== tenantId) return undefined;
    return lead;
  }

  async findByIds(ids: string[], tenantId: string): Promise<Lead[]> {
    return ids
      .map((id) => this.leads.get(id))
      .filter((lead): lead is Lead => !!lead && lead.tenantId === tenantId);
  }

  async query(params: LeadQueryParams): Promise<LeadQueryResult> {
    let results = Array.from(this.leads.values()).filter((l) => l.tenantId === params.tenantId);

    if (params.filter) {
      results = this.applyFilter(results, params.filter);
    }

    const total = results.length;
    const limit = params.limit ?? 50;
    const offset = params.offset ?? 0;
    
    results = results.slice(offset, offset + limit);

    return {
      leads: results,
      total,
      hasMore: offset + limit < total,
    };
  }

  async update(id: string, tenantId: string, updates: Partial<Lead>): Promise<Lead | undefined> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return undefined;

    const updated: Lead = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.leads.set(id, updated);
    return updated;
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const lead = await this.findById(id, tenantId);
    if (!lead) return false;
    return this.leads.delete(id);
  }

  async countByStatus(tenantId: string): Promise<Record<string, number>> {
    const leads = Array.from(this.leads.values()).filter((l) => l.tenantId === tenantId);
    const counts: Record<string, number> = {};
    
    for (const lead of leads) {
      counts[lead.status] = (counts[lead.status] ?? 0) + 1;
    }
    
    return counts;
  }

  async countBySource(tenantId: string): Promise<Record<string, number>> {
    const leads = Array.from(this.leads.values()).filter((l) => l.tenantId === tenantId);
    const counts: Record<string, number> = {};
    
    for (const lead of leads) {
      counts[lead.source] = (counts[lead.source] ?? 0) + 1;
    }
    
    return counts;
  }

  private applyFilter(leads: Lead[], filter: CrmFilter): Lead[] {
    return leads.filter((lead) => {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch = 
          lead.firstName.toLowerCase().includes(searchLower) ||
          lead.lastName.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      if (filter.status && lead.status !== filter.status) return false;
      if (filter.assignedTo && lead.assignedTo !== filter.assignedTo) return false;
      
      if (filter.minScore !== undefined && lead.score !== undefined && lead.score < filter.minScore) {
        return false;
      }
      if (filter.maxScore !== undefined && lead.score !== undefined && lead.score > filter.maxScore) {
        return false;
      }
      
      if (filter.tags && filter.tags.length > 0) {
        const hasTag = filter.tags.some((tag) => lead.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }

  private generateId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}