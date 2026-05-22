import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { AuthSession, AuthUser } from "./types";
import { normalizeAuthRole } from "./roles";
import { resolveProfile } from "./profile";

/**
 * Synchronous mapping fallback (auth metadata only).
 * Used during the initial paint before the profiles table is fetched.
 */
export function mapUser(supabaseUser: User): AuthUser {
  const metadata = supabaseUser.user_metadata || {};
  const role = normalizeAuthRole(metadata.role);

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    fullName: metadata.full_name || metadata.name || supabaseUser.email?.split("@")[0] || "User",
    role,
    avatarUrl: metadata.avatar_url || undefined,
    organizationId: (metadata.organization_id as string | undefined) ?? null,
  };
}

export function mapSession(supabaseSession: Session | null): AuthSession | null {
  if (!supabaseSession?.user) return null;
  return {
    user: mapUser(supabaseSession.user),
    accessToken: supabaseSession.access_token,
    expiresAt: supabaseSession.expires_at
      ? supabaseSession.expires_at * 1000
      : Date.now() + 60 * 60 * 1000,
  };
}

/**
 * Async session mapping that consults the profiles table for the
 * authoritative role and full name. Falls back to metadata transparently.
 */
export async function mapSessionAsync(
  supabaseSession: Session | null,
): Promise<AuthSession | null> {
  if (!supabaseSession?.user) return null;
  const resolved = await resolveProfile(supabaseSession.user);
  return {
    user: resolved.user,
    accessToken: supabaseSession.access_token,
    expiresAt: supabaseSession.expires_at
      ? supabaseSession.expires_at * 1000
      : Date.now() + 60 * 60 * 1000,
  };
}

export async function getSession(supabase: SupabaseClient): Promise<AuthSession | null> {
  const { data } = await supabase.auth.getSession();
  return mapSessionAsync(data.session);
}
