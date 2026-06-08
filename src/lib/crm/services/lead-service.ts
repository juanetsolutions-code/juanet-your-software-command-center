// Minimal in-memory mock lead service for UI compatibility.
import type { Lead } from "../core/crm-entities";
import type { LeadStatus } from "../core/crm-types";

export type LeadCreateParams = Omit<Lead, "id" | "createdAt" | "updatedAt">;
export type LeadUpdateParams = Partial<Omit<Lead, "id" | "tenantId" | "createdAt" | "updatedAt">>;

export class LeadService {
  private leads = new Map<string, Lead>();

  async create(params: LeadCreateParams, tenantId: string): Promise<Lead> {
    const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const lead = { ...params, id, tenantId, createdAt: now, updatedAt: now } as Lead;
    this.leads.set(id, lead);
    return lead;
  }

  async update(
    leadId: string,
    updates: LeadUpdateParams,
    _tenantId: string,
  ): Promise<Lead | undefined> {
    const existing = this.leads.get(leadId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() } as Lead;
    this.leads.set(leadId, updated);
    return updated;
  }

  async getById(leadId: string, _tenantId: string): Promise<Lead | undefined> {
    return this.leads.get(leadId);
  }

  async list(tenantId: string, status?: LeadStatus): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (l) => l.tenantId === tenantId && (!status || l.status === status),
    );
  }
}

export const leadService = new LeadService();
