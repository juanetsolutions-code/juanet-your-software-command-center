import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { DbProfile } from "@/lib/supabase/types";
import { handleSupabaseError, safeSelectFrom, safeInsert, safeUpdate } from "./_shared";

/**
 * Profiles repository — real Supabase integration for user profiles.
 * Used to ensure profile row exists post-auth and for future profile management.
 * Always safe: never throws, falls back to mock on any failure.
 */

const MOCK_PROFILE: DbProfile = {
  id: "mock-user",
  organization_id: null,
  full_name: "Mock User",
  role: "client",
  avatar_url: null,
  created_at: new Date().toISOString(),
};

export async function getCurrentProfile(userId: string): Promise<DbProfile | null> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock profile data");
    return { ...MOCK_PROFILE, id: userId };
  }

  const start = Date.now();
  try {
    const rows = await safeSelectFrom<DbProfile>(supabase, "getCurrentProfile", (c) =>
      c.from("profiles").select("*").eq("id", userId).limit(1),
    );
    const duration = Date.now() - start;
    logger.info(
      `[Repo] getCurrentProfile(${userId}) → ${rows.length ? "real" : "empty"} (${duration}ms)`,
    );
    return rows[0] ?? null;
  } catch (err) {
    handleSupabaseError(err, "getCurrentProfile");
    logger.warn("[Repo] getCurrentProfile fallback to mock");
    return { ...MOCK_PROFILE, id: userId };
  }
}

export async function updateProfile(
  userId: string,
  data: Partial<Omit<DbProfile, "id" | "created_at">>,
): Promise<DbProfile | null> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Skipped profile update");
    return { ...MOCK_PROFILE, id: userId, ...data } as DbProfile;
  }

  const start = Date.now();
  try {
    const updated = await safeUpdate<DbProfile>(
      supabase,
      "updateProfile",
      "profiles",
      data as Record<string, unknown>,
      { id: userId },
    );
    const duration = Date.now() - start;
    logger.info(`[Repo] updateProfile(${userId}) (${duration}ms)`);
    return updated;
  } catch (err) {
    handleSupabaseError(err, "updateProfile");
    return null;
  }
}

export async function createProfileIfMissing(
  userId: string,
  defaults?: Partial<DbProfile>,
): Promise<DbProfile | null> {
  const existing = await getCurrentProfile(userId);
  if (existing) return existing;

  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Created mock profile (no DB)");
    return { ...MOCK_PROFILE, id: userId, ...defaults } as DbProfile;
  }

  const insertPayload: Record<string, unknown> = {
    id: userId,
    full_name: defaults?.full_name ?? "User",
    role: defaults?.role ?? "client",
    organization_id: defaults?.organization_id ?? null,
    avatar_url: defaults?.avatar_url ?? null,
  };

  const start = Date.now();
  try {
    const created = await safeInsert<DbProfile>(
      supabase,
      "createProfileIfMissing",
      "profiles",
      insertPayload,
    );
    const duration = Date.now() - start;
    logger.info(`[Repo] createProfileIfMissing(${userId}) (${duration}ms)`);
    return created ?? ({ ...MOCK_PROFILE, id: userId, ...defaults } as DbProfile);
  } catch (err) {
    handleSupabaseError(err, "createProfileIfMissing");
    return { ...MOCK_PROFILE, id: userId, ...defaults } as DbProfile;
  }
}
