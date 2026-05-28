import { LeadRepository } from "../repository/lead-repository";
import { crmService } from "./crm-service";
import type { Lead } from "../core/crm-entities";
import type { LeadStatus } from "../core/crm-types";
import { emitEvent } from "@/lib/event-bus";
import { recordActivity } from "@/lib/activity/activity-feed";

export type LeadCreateParams = Omit<Lead, "id" | "createdAt" | "updatedAt">;

export type LeadUpdateParams = Partial<Omit<Lead, "id" | "tenantId" | "createdAt" | "updatedAt">>;

export class LeadService {
  private repository = new LeadRepository();

  async create(params: LeadCreateParams, tenantId: string): Promise<Lead> {
    const lead = await this.repository.create({
      ...params,
      tenantId,
    });

    emitEvent({
      id: `evt_${Date.now()}`,
      type: "lead.created",
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { leadId: lead.id },
      version: "1.0",
    });

    recordActivity({
      tenantId,
      userId: lead.assignedTo,
      action: "lead_created",
      targetType: "lead",
      targetId: lead.id,
      metadata: { leadName: `${lead.firstName} ${lead.lastName}` },
    });

    return lead;
  }

  async update(leadId: string, updates: LeadUpdateParams, tenantId: string): Promise<Lead | undefined> {
    const lead = await this.repository.findById(leadId, tenantId);
    if (!lead) return undefined;

    const updated = await this.repository.update(leadId, tenantId, updates);
    
    if (updated) {
      emitEvent({
        id: `evt_${Date.now()}`,
        type: "lead.updated",
        tenantId,
        timestamp: new Date().toISOString(),
        payload: { leadId: updated.id, changes: updates },
        version: "1.0",
      });

      recordActivity({
        tenantId,
        userId: updates.assignedTo,
        action: "lead_updated",
        targetType: "lead",
        targetId: leadId,
        metadata: { changes: updates },
      });
    }

    return updated;
  }

  async convertToContact(leadId: string, tenantId: string): Promise<void> {
    const lead = await this.repository.findById(leadId, tenantId);
    if (!lead) return;

    await this.repository.update(leadId, tenantId, { status: "converted" });
    
    await crmService.contacts.create({
      tenantId,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      leadId: lead.id,
      type: "customer",
    });

    emitEvent({
      id: `evt_${Date.now()}`,
      type: "contact.created",
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { leadId, contactId: leadId },
      version: "1.0",
    });
  }

  async getById(leadId: string, tenantId: string): Promise<Lead | undefined> {
    return this.repository.findById(leadId, tenantId);
  }

  async list(tenantId: string, status?: LeadStatus): Promise<Lead[]> {
    const result = await this.repository.query({
      tenantId,
      filter: status ? { status } : undefined,
    });
    return result.leads;
  }
}

export const leadService = new LeadService();