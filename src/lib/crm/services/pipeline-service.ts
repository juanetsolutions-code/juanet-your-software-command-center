/**
 * Supabase-backed Pipeline service.
 */
import { supabase } from "@/lib/supabase/client";

export type PipelineStage = {
  id: string;
  pipelineId: string;
  name: string;
  position: number;
  probability: number;
  color?: string;
};

export type Pipeline = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  stages: PipelineStage[];
};

function rowToStage(r: any): PipelineStage {
  return {
    id: r.id,
    pipelineId: r.pipeline_id,
    name: r.name,
    position: r.position,
    probability: r.probability,
    color: r.color ?? undefined,
  };
}

export class PipelineService {
  async list(orgId: string): Promise<Pipeline[]> {
    const { data: pipelines, error } = await supabase
      .from("crm_pipelines")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    if (!pipelines?.length) return [];

    const ids = pipelines.map((p) => p.id);
    const { data: stages } = await supabase
      .from("crm_pipeline_stages")
      .select("*")
      .in("pipeline_id", ids)
      .order("position", { ascending: true });

    return pipelines.map((p) => ({
      id: p.id,
      organizationId: p.organization_id,
      name: p.name,
      description: p.description ?? undefined,
      isActive: p.is_active,
      createdAt: p.created_at,
      stages: (stages ?? []).filter((s) => s.pipeline_id === p.id).map(rowToStage),
    }));
  }

  async create(
    orgId: string,
    params: { name: string; description?: string; stages?: { name: string; probability: number }[] },
  ): Promise<Pipeline> {
    const { data: created, error } = await supabase
      .from("crm_pipelines")
      .insert({
        organization_id: orgId,
        name: params.name,
        description: params.description ?? null,
        is_active: true,
      })
      .select("*")
      .single();
    if (error || !created) throw error ?? new Error("Failed to create pipeline");

    const stagesInput =
      params.stages?.map((s, i) => ({
        pipeline_id: created.id,
        name: s.name,
        position: i + 1,
        probability: s.probability,
      })) ?? [];

    if (stagesInput.length) {
      await supabase.from("crm_pipeline_stages").insert(stagesInput);
    }

    return {
      id: created.id,
      organizationId: created.organization_id,
      name: created.name,
      description: created.description ?? undefined,
      isActive: created.is_active,
      createdAt: created.created_at,
      stages: [],
    };
  }

  async remove(id: string, orgId: string): Promise<void> {
    const { error } = await supabase
      .from("crm_pipelines")
      .delete()
      .eq("id", id)
      .eq("organization_id", orgId);
    if (error) throw error;
  }
}

export const pipelineService = new PipelineService();
