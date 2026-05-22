import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { Project, ProjectStatus } from "@/lib/dashboard/types";
import type { DbProject } from "@/lib/supabase/types";
import { mockProjects } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelectFrom } from "./_shared";
import { get as cacheGet, set as cacheSet } from "../cache";
import { scopedQuery } from "@/lib/tenant/context";

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
    status: (row.status as ProjectStatus) || "pending",
    progress: row.progress ?? 0,
    dueAt: row.updated_at ?? new Date().toISOString(),
    dueLabel: "—",
    leadName: "—",
    updatedLabel: "just now",
  };
}

export async function listProjects(): Promise<Project[]> {
  const cacheKey = "repo:projects:list";
  const cached = cacheGet<Project[]>(cacheKey);
  if (cached) {
    logger.info("[Repo] listProjects cache hit");
    return cached;
  }

  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock projects data");
    return mockProjects;
  }

  try {
    const rows = await safeSelectFrom<DbProject>(supabase, "listProjects", (c) => {
      let q = c.from("projects").select("*").order("updated_at", { ascending: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = scopedQuery(q as any) as any;
      return q;
    });
    const result = rows.length === 0 ? mockProjects : rows.map(mapDbProjectToProject);
    cacheSet(cacheKey, result, 45_000); // 45s TTL
    logger.info(
      `[Repo] listProjects source=${rows.length ? "supabase" : "mock-fallback"} count=${result.length}`,
    );
    return result;
  } catch (err) {
    handleSupabaseError(err, "listProjects");
    return mockProjects;
  }
}

export async function getProject(id: string): Promise<Project | undefined> {
  const cacheKey = `repo:projects:${id}`;
  const cached = cacheGet<Project>(cacheKey);
  if (cached) return cached;

  if (!SUPABASE_READY) {
    const hit = mockProjects.find((p) => p.id === id);
    return hit;
  }

  try {
    const rows = await safeSelectFrom<DbProject>(supabase, "getProject", (c) =>
      c.from("projects").select("*").eq("id", id).limit(1),
    );
    if (rows.length === 0) {
      const mockHit = mockProjects.find((p) => p.id === id);
      return mockHit;
    }
    const mapped = mapDbProjectToProject(rows[0]);
    cacheSet(cacheKey, mapped, 60_000);
    logger.info(`[Repo] getProject(${id}) source=supabase`);
    return mapped;
  } catch (err) {
    handleSupabaseError(err, "getProject");
    logger.warn("[Repo] getProject fallback to mock");
    return mockProjects.find((p) => p.id === id);
  }
}
