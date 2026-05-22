import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { DbOrganization } from "@/lib/supabase/types";
import type { Organization } from "@/lib/tenant/types";
import { handleSupabaseError, safeSelectFrom, safeInsert, safeUpdate } from "./_shared";
import { get as cacheGet, set as cacheSet, afterMutation } from "../cache";
import { getCurrentUserId } from "../query-context";

/**
 * Organizations repository — multi-tenant core.
 * All operations safe, with mock fallback.
 */

const MOCK_ORGS: Organization[] = [];

function mapDbToDomain(row: DbOrganization): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    plan: (row.plan as any) || "free", // eslint-disable-line @typescript-eslint/no-explicit-any
    createdAt: row.created_at,
  };
}

export async function listOrganizations(): Promise<Organization[]> {
  const cacheKey = "orgs:list";
  const cached = cacheGet<Organization[]>(cacheKey);
  if (cached) return cached;

  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] listOrganizations");
    return MOCK_ORGS;
  }

  try {
    const rows = await safeSelectFrom<DbOrganization>(supabase, "listOrganizations", (c) =>
      c.from("organizations").select("*").order("created_at", { ascending: false }),
    );
    const result = rows.map(mapDbToDomain);
    cacheSet(cacheKey, result, 60_000);
    return result;
  } catch (err) {
    handleSupabaseError(err, "listOrganizations");
    return MOCK_ORGS;
  }
}

export async function getUserOrganizations(userId?: string): Promise<Organization[]> {
  const uid = userId || getCurrentUserId();
  if (!uid) return [];

  const cacheKey = `orgs:user:${uid}`;
  const cached = cacheGet<Organization[]>(cacheKey);
  if (cached) return cached;

  if (!SUPABASE_READY) {
    return MOCK_ORGS;
  }

  try {
    // Join via organization_members for user's orgs
    const { data, error } = await supabase
      .from("organization_members")
      .select("organization_id, organizations(*)")
      .eq("profile_id", uid);

    if (error) throw error;

    const result: Organization[] = (data || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((m: any) => m.organizations)
      .filter(Boolean)
      .map(mapDbToDomain);

    cacheSet(cacheKey, result, 30_000);
    return result;
  } catch (err) {
    handleSupabaseError(err, "getUserOrganizations");
    return MOCK_ORGS;
  }
}

export async function getOrganization(id: string): Promise<Organization | null> {
  if (!SUPABASE_READY) return MOCK_ORGS.find((o) => o.id === id) || null;

  try {
    const rows = await safeSelectFrom<DbOrganization>(supabase, "getOrganization", (c) =>
      c.from("organizations").select("*").eq("id", id).limit(1),
    );
    return rows[0] ? mapDbToDomain(rows[0]) : null;
  } catch (err) {
    handleSupabaseError(err, "getOrganization");
    return null;
  }
}

export async function createOrganization(data: {
  name: string;
  slug: string;
  plan?: string;
}): Promise<Organization | null> {
  if (!SUPABASE_READY) {
    const mockOrg: Organization = {
      id: `mock-org-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plan: (data.plan as any) || "free",
      createdAt: new Date().toISOString(),
    };
    MOCK_ORGS.push(mockOrg);
    return mockOrg;
  }

  const userId = getCurrentUserId();
  const payload: Record<string, unknown> = {
    name: data.name,
    slug: data.slug,
    plan: data.plan || "free",
  };

  try {
    const inserted = await safeInsert<DbOrganization>(
      supabase,
      "createOrganization",
      "organizations",
      payload,
    );
    if (inserted) {
      // auto add current user as owner
      if (userId) {
        await safeInsert(supabase, "createOrgOwner", "organization_members", {
          organization_id: inserted.id,
          profile_id: userId,
          role: "owner",
        });
      }
      afterMutation("organizations");
      return mapDbToDomain(inserted);
    }
    return null;
  } catch (err) {
    handleSupabaseError(err, "createOrganization");
    return null;
  }
}

export async function updateOrganization(
  id: string,
  data: Partial<{ name: string; plan: string }>,
): Promise<Organization | null> {
  if (!SUPABASE_READY) return null;

  try {
    const updated = await safeUpdate<DbOrganization>(
      supabase,
      "updateOrganization",
      "organizations",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data as any,
      { id },
    );
    if (updated) {
      afterMutation("organizations");
      return mapDbToDomain(updated);
    }
    return null;
  } catch (err) {
    handleSupabaseError(err, "updateOrganization");
    return null;
  }
}
