/**
 * Supabase-backed Lead service.
 * Maps snake_case rows ↔ camelCase domain entities.
 */
import { supabase } from "@/lib/supabase/client";
import type { Lead } from "../core/crm-entities";
import type { LeadStatus, LeadSource } from "../core/crm-types";

export type LeadCreateParams = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: LeadSource | string;
  status?: LeadStatus;
  score?: number;
  value?: number;
  tags?: string[];
};

export type LeadUpdateParams = Partial<LeadCreateParams>;

function rowToLead(r: any): Lead {
  return {
    id: r.id,
    tenantId: r.organization_id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone ?? undefined,
    company: r.company ?? undefined,
    title: r.title ?? undefined,
    source: (r.source ?? "other") as LeadSource,
    status: (r.status ?? "new") as LeadStatus,
    score: r.score ?? 0,
    value: r.value ?? undefined,
    assignedTo: r.assigned_to ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    lastContactedAt: r.last_contacted_at ?? undefined,
    tags: r.tags ?? [],
  };
}

export class LeadService {
  async create(params: LeadCreateParams, orgId: string): Promise<Lead> {
    const { data, error } = await supabase
      .from("crm_leads")
      .insert({
        organization_id: orgId,
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        phone: params.phone ?? null,
        company: params.company ?? null,
        title: params.title ?? null,
        source: params.source ?? "other",
        status: params.status ?? "new",
        score: params.score ?? 0,
        value: params.value ?? null,
        tags: params.tags ?? [],
      })
      .select("*")
      .single();
    if (error || !data) throw error ?? new Error("Failed to create lead");
    return rowToLead(data);
  }

  async update(leadId: string, updates: LeadUpdateParams, orgId: string): Promise<Lead | undefined> {
    const patch: Record<string, unknown> = {};
    if (updates.firstName !== undefined) patch.first_name = updates.firstName;
    if (updates.lastName !== undefined) patch.last_name = updates.lastName;
    if (updates.email !== undefined) patch.email = updates.email;
    if (updates.phone !== undefined) patch.phone = updates.phone;
    if (updates.company !== undefined) patch.company = updates.company;
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.source !== undefined) patch.source = updates.source;
    if (updates.status !== undefined) patch.status = updates.status;
    if (updates.score !== undefined) patch.score = updates.score;
    if (updates.value !== undefined) patch.value = updates.value;
    if (updates.tags !== undefined) patch.tags = updates.tags;

    const { data, error } = await supabase
      .from("crm_leads")
      .update(patch)
      .eq("id", leadId)
      .eq("organization_id", orgId)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? rowToLead(data) : undefined;
  }

  async getById(leadId: string, orgId: string): Promise<Lead | undefined> {
    const { data, error } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("id", leadId)
      .eq("organization_id", orgId)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToLead(data) : undefined;
  }

  async list(orgId: string, status?: LeadStatus): Promise<Lead[]> {
    let q = supabase
      .from("crm_leads")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(rowToLead);
  }

  async remove(leadId: string, orgId: string): Promise<void> {
    const { error } = await supabase
      .from("crm_leads")
      .delete()
      .eq("id", leadId)
      .eq("organization_id", orgId);
    if (error) throw error;
  }
}

export const leadService = new LeadService();
