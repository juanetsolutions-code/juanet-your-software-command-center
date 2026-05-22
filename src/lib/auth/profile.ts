/**
 * Profile system — fetches the user's row from the `profiles` table and
 * merges it into the AuthUser. Falls back to Supabase user metadata when
 * the profiles table is missing or the row hasn't been provisioned yet.
 *
 * Designed to keep the existing AuthContext API stable.
 */

import type { User } from "@supabase/supabase-js";
import { supabase, SUPABASE_READY } from "@/lib/supabase/client";
import { logger } from "@/lib/utils/logger";
import { normalizeAuthRole } from "./roles";
import type { AuthRole, AuthUser } from "./types";
import type { DbProfile } from "@/lib/supabase/types";

export interface ProfileResolved {
  user: AuthUser;
  organizationId: string | null;
  source: "profile" | "metadata";
}

const profileCache = new Map<string, ProfileResolved>();

export function clearProfileCache(userId?: string): void {
  if (userId) profileCache.delete(userId);
  else profileCache.clear();
}

function mergeFromMetadata(supabaseUser: User, role: AuthRole): AuthUser {
  const md = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    fullName: md.full_name || md.name || supabaseUser.email?.split("@")[0] || "User",
    role,
    avatarUrl: md.avatar_url || undefined,
    organizationId: (md.organization_id as string | undefined) ?? null,
  };
}

/**
 * Resolve the canonical profile for a Supabase user.
 * - Tries `profiles` table first (role source of truth).
 * - Falls back to auth metadata when unavailable, missing, or in mock mode.
 */
export async function resolveProfile(supabaseUser: User): Promise<ProfileResolved> {
  const cached = profileCache.get(supabaseUser.id);
  if (cached) return cached;

  const metadataRole = normalizeAuthRole(supabaseUser.user_metadata?.role);

  if (!SUPABASE_READY) {
    const resolved: ProfileResolved = {
      user: mergeFromMetadata(supabaseUser, metadataRole),
      organizationId: null,
      source: "metadata",
    };
    profileCache.set(supabaseUser.id, resolved);
    return resolved;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, organization_id, full_name, role, avatar_url, created_at")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const row = data as DbProfile;
      const role = normalizeAuthRole(row.role ?? metadataRole);
      const merged: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email ?? "",
        fullName: row.full_name || mergeFromMetadata(supabaseUser, role).fullName,
        role,
        avatarUrl: row.avatar_url || supabaseUser.user_metadata?.avatar_url || undefined,
        organizationId: row.organization_id,
      };
      const resolved: ProfileResolved = {
        user: merged,
        organizationId: row.organization_id,
        source: "profile",
      };
      profileCache.set(supabaseUser.id, resolved);
      return resolved;
    }
  } catch (err) {
    logger.warn("[profile] resolveProfile failed, falling back to metadata", err);
  }

  const fallback: ProfileResolved = {
    user: mergeFromMetadata(supabaseUser, metadataRole),
    organizationId: null,
    source: "metadata",
  };
  profileCache.set(supabaseUser.id, fallback);
  return fallback;
}
