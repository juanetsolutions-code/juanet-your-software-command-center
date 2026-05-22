import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { DbWorkspace } from "@/lib/supabase/types";
import { handleSupabaseError, safeSelectFrom, safeInsert, safeUpdate } from "./_shared";
import { get as cacheGet, set as cacheSet, afterMutation } from "../cache";
import { getCurrentUserId } from "../query-context";
import { getCurrentOrganization } from "@/lib/tenant/context";

/**
 * Workspaces repository — organization-scoped.
 */

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  createdAt: string;
}

function mapDbWorkspace(row: DbWorkspace): Workspace {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
  };
}

export async function listWorkspaces(orgId?: string): Promise<Workspace[]> {
  const currentOrg = orgId || getCurrentOrganization()?.id;
  const cacheKey = `workspaces:${currentOrg || "all"}`;
  const cached = cacheGet<Workspace[]>(cacheKey);
  if (cached) return cached;

  if (!SUPABASE_READY || !currentOrg) {
    logger.info("[Mock Mode] listWorkspaces");
    return [];
  }

  try {
    const rows = await safeSelectFrom<DbWorkspace>(supabase, "listWorkspaces", (c) =>
      c
        .from("workspaces")
        .select("*")
        .eq("organization_id", currentOrg)
        .order("created_at", { ascending: false }),
    );
    const result = rows.map(mapDbWorkspace);
    cacheSet(cacheKey, result, 45_000);
    return result;
  } catch (err) {
    handleSupabaseError(err, "listWorkspaces");
    return [];
  }
}

export async function getWorkspace(id: string): Promise<Workspace | null> {
  if (!SUPABASE_READY) return null;

  try {
    const rows = await safeSelectFrom<DbWorkspace>(supabase, "getWorkspace", (c) =>
      c.from("workspaces").select("*").eq("id", id).limit(1),
    );
    return rows[0] ? mapDbWorkspace(rows[0]) : null;
  } catch (err) {
    handleSupabaseError(err, "getWorkspace");
    return null;
  }
}

export async function createWorkspace(data: {
  name: string;
  slug: string;
  organizationId?: string;
}): Promise<Workspace | null> {
  const orgId = data.organizationId || getCurrentOrganization()?.id;
  if (!SUPABASE_READY || !orgId) {
    logger.info("[Mock Mode] createWorkspace");
    return {
      id: `mock-ws-${Date.now()}`,
      organizationId: orgId || "mock-org",
      name: data.name,
      slug: data.slug,
      createdAt: new Date().toISOString(),
    };
  }

  const userId = getCurrentUserId();
  const payload = {
    name: data.name,
    slug: data.slug,
    organization_id: orgId,
    created_by: userId,
  };

  try {
    const inserted = await safeInsert<DbWorkspace>(
      supabase,
      "createWorkspace",
      "workspaces",
      payload,
    );
    if (inserted) {
      afterMutation("workspaces");
      return mapDbWorkspace(inserted);
    }
    return null;
  } catch (err) {
    handleSupabaseError(err, "createWorkspace");
    return null;
  }
}

export async function updateWorkspace(
  id: string,
  data: Partial<{ name: string }>,
): Promise<Workspace | null> {
  if (!SUPABASE_READY) return null;

  try {
    const updated = await safeUpdate<DbWorkspace>(
      supabase,
      "updateWorkspace",
      "workspaces",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data as any,
      { id },
    );
    if (updated) {
      afterMutation("workspaces");
      return mapDbWorkspace(updated);
    }
    return null;
  } catch (err) {
    handleSupabaseError(err, "updateWorkspace");
    return null;
  }
}
