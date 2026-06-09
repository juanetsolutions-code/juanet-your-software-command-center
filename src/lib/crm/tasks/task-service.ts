/**
 * Supabase-backed task service. Stores tasks as crm_activities with type='task'.
 */
import { supabase } from "@/lib/supabase/client";
import type { ActivityType } from "../core/crm-types";

export type CrmTask = {
  id: string;
  tenantId: string;
  entityType: "lead" | "contact" | "deal" | "account";
  entityId: string;
  title: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  type: ActivityType;
};

function rowToTask(r: any): CrmTask {
  // Encode priority/status in `outcome` field as "priority:status"
  const [priority = "medium", status = "pending"] = (r.outcome ?? "").split(":");
  return {
    id: r.id,
    tenantId: r.organization_id,
    entityType: r.entity_type,
    entityId: r.entity_id,
    title: r.subject,
    description: r.description ?? undefined,
    dueDate: r.scheduled_at ?? undefined,
    completedAt: r.completed_at ?? undefined,
    priority: priority as CrmTask["priority"],
    assignedTo: r.user_id ?? undefined,
    status: status as CrmTask["status"],
    type: (r.type ?? "task") as ActivityType,
  };
}

export class TaskService {
  async getAll(orgId?: string): Promise<CrmTask[]> {
    if (!orgId) return [];
    const { data, error } = await supabase
      .from("crm_activities")
      .select("*")
      .eq("organization_id", orgId)
      .eq("type", "task")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToTask);
  }

  async create(
    orgId: string,
    params: {
      title: string;
      description?: string;
      entityType: CrmTask["entityType"];
      entityId: string;
      dueDate?: string;
      priority?: CrmTask["priority"];
    },
  ): Promise<CrmTask> {
    const priority = params.priority ?? "medium";
    const { data, error } = await supabase
      .from("crm_activities")
      .insert({
        organization_id: orgId,
        entity_type: params.entityType,
        entity_id: params.entityId,
        type: "task",
        subject: params.title,
        description: params.description ?? null,
        scheduled_at: params.dueDate ?? null,
        outcome: `${priority}:pending`,
      })
      .select("*")
      .single();
    if (error || !data) throw error ?? new Error("Failed to create task");
    return rowToTask(data);
  }

  async setStatus(taskId: string, status: CrmTask["status"], orgId: string): Promise<void> {
    // We need to preserve priority — fetch first.
    const { data: row } = await supabase
      .from("crm_activities")
      .select("outcome")
      .eq("id", taskId)
      .maybeSingle();
    const priority = (row?.outcome ?? "medium:pending").split(":")[0];
    const patch: Record<string, unknown> = { outcome: `${priority}:${status}` };
    if (status === "completed") patch.completed_at = new Date().toISOString();
    const { error } = await supabase
      .from("crm_activities")
      .update(patch)
      .eq("id", taskId)
      .eq("organization_id", orgId);
    if (error) throw error;
  }
}

export const taskService = new TaskService();
