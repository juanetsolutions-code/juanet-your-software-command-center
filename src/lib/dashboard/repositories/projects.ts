import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { Project } from "@/lib/dashboard/types";
import type { DbProject } from "@/lib/supabase/types";
import { mockProjects } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelect } from "./_shared";

/**
 * Maps a raw Supabase projects row to the frontend Project type.
 * This is a minimal safe mapper for the first real integration.
 */
function mapDbProjectToProject(row: DbProject): Project {
  return {
    id: row.id,
    name: row.title ?? "Untitled Project",
    client: "—", // placeholder until we join profiles
    category: "—",
    status: (row.status as any) || "pending",
    progress: row.progress ?? 0,
    dueAt: row.updated_at ?? new Date().toISOString(),
    dueLabel: "—",
    leadName: "—",
    updatedLabel: "just now",
  };
}

export async function listProjects(): Promise<Project[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock projects data");
    return mockProjects;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const rows = safeSelect<DbProject>(data);
    return rows.map(mapDbProjectToProject);
  } catch (err) {
    handleSupabaseError(err, "listProjects");
    logger.warn("[Supabase] Falling back to mock data");
    return mockProjects;
  }
}

export async function getProject(id: string): Promise<Project | undefined> {
  if (!SUPABASE_READY) {
    return mockProjects.find((p) => p.id === id);
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return mapDbProjectToProject(data as DbProject);
  } catch (err) {
    handleSupabaseError(err, "getProject");
    logger.warn("[Supabase] Falling back to mock data");
    return mockProjects.find((p) => p.id === id);
  }
}
