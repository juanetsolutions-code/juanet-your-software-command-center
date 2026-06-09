/**
 * Supabase-backed Deal service.
 */
import { supabase } from "@/lib/supabase/client";
import type { Deal } from "../core/crm-entities";
import type { DealStage, DealPriority } from "../core/crm-types";
import { ensureDefaultPipeline } from "@/lib/tenant/bootstrap";

export type DealCreateParams = {
  name: string;
  value: number;
  stage?: DealStage | string;
  priority?: DealPriority;
  probability?: number;
  expectedCloseDate?: string;
  description?: string;
  pipelineId?: string;
  leadId?: string;
  contactId?: string;
  accountId?: string;
};

export type DealUpdateParams = Partial<DealCreateParams> & {
  actualCloseDate?: string;
};

function rowToDeal(r: any): Deal {
  return {
    id: r.id,
    tenantId: r.organization_id,
    pipelineId: r.pipeline_id,
    leadId: r.lead_id ?? undefined,
    contactId: r.contact_id ?? undefined,
    accountId: r.account_id ?? undefined,
    name: r.name,
    description: r.description ?? undefined,
    value: Number(r.value ?? 0),
    stage: (r.stage ?? "qualification") as DealStage,
    priority: (r.priority ?? "medium") as DealPriority,
    probability: r.probability ?? 0,
    expectedCloseDate: r.expected_close_date ?? undefined,
    actualCloseDate: r.actual_close_date ?? undefined,
    assignedTo: r.assigned_to ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export class DealService {
  async create(params: DealCreateParams, orgId: string): Promise<Deal> {
    const pipelineId = params.pipelineId || (await ensureDefaultPipeline(orgId));
    if (!pipelineId) throw new Error("No pipeline available");

    const { data, error } = await supabase
      .from("crm_deals")
      .insert({
        organization_id: orgId,
        pipeline_id: pipelineId,
        lead_id: params.leadId ?? null,
        contact_id: params.contactId ?? null,
        account_id: params.accountId ?? null,
        name: params.name,
        description: params.description ?? null,
        value: params.value,
        stage: params.stage ?? "qualification",
        priority: params.priority ?? "medium",
        probability: params.probability ?? 0,
        expected_close_date: params.expectedCloseDate ?? null,
      })
      .select("*")
      .single();
    if (error || !data) throw error ?? new Error("Failed to create deal");
    return rowToDeal(data);
  }

  async update(dealId: string, updates: DealUpdateParams, orgId: string): Promise<Deal | undefined> {
    const patch: Record<string, unknown> = {};
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.value !== undefined) patch.value = updates.value;
    if (updates.stage !== undefined) patch.stage = updates.stage;
    if (updates.priority !== undefined) patch.priority = updates.priority;
    if (updates.probability !== undefined) patch.probability = updates.probability;
    if (updates.expectedCloseDate !== undefined) patch.expected_close_date = updates.expectedCloseDate;
    if (updates.actualCloseDate !== undefined) patch.actual_close_date = updates.actualCloseDate;
    if (updates.pipelineId !== undefined) patch.pipeline_id = updates.pipelineId;

    const { data, error } = await supabase
      .from("crm_deals")
      .update(patch)
      .eq("id", dealId)
      .eq("organization_id", orgId)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? rowToDeal(data) : undefined;
  }

  async moveStage(dealId: string, stage: DealStage, orgId: string): Promise<Deal | undefined> {
    return this.update(dealId, { stage }, orgId);
  }

  async list(orgId: string, stage?: DealStage): Promise<Deal[]> {
    let q = supabase
      .from("crm_deals")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    if (stage) q = q.eq("stage", stage);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(rowToDeal);
  }

  async getById(dealId: string, orgId: string): Promise<Deal | undefined> {
    const { data, error } = await supabase
      .from("crm_deals")
      .select("*")
      .eq("id", dealId)
      .eq("organization_id", orgId)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToDeal(data) : undefined;
  }

  async forecastRevenue(orgId: string): Promise<number> {
    const deals = await this.list(orgId);
    return deals
      .filter((d) => d.stage !== "closed_lost")
      .reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);
  }

  async remove(dealId: string, orgId: string): Promise<void> {
    const { error } = await supabase
      .from("crm_deals")
      .delete()
      .eq("id", dealId)
      .eq("organization_id", orgId);
    if (error) throw error;
  }
}

export const dealService = new DealService();
