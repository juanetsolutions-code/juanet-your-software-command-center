import type { Session, User } from "@supabase/supabase-js";
import type { AuthSession, AuthUser, AuthRole } from "./types";

/**
 * Maps a Supabase user to our internal AuthUser type.
 * Role defaults to "client" until we add a profiles table with role column.
 */
export function mapUser(supabaseUser: User): AuthUser {
  const metadata = supabaseUser.user_metadata || {};
  const role: AuthRole = (metadata.role as AuthRole) || "client";

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    fullName:
      metadata.full_name ||
      metadata.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    role,
    avatarUrl: metadata.avatar_url || undefined,
  };
}

/**
 * Converts a Supabase session into our internal AuthSession format.
 */
export function mapSession(supabaseSession: Session | null): AuthSession | null {
  if (!supabaseSession?.user) return null;

  const user = mapUser(supabaseSession.user);

  return {
    user,
    accessToken: supabaseSession.access_token,
    expiresAt: supabaseSession.expires_at
      ? supabaseSession.expires_at * 1000
      : Date.now() + 60 * 60 * 1000,
  };
}

/**
 * Convenience helper to get the current session from Supabase.
 * (Used later when we wire real auth.)
 */
export async function getSession(supabase: any): Promise<AuthSession | null> {
  const { data } = await supabase.auth.getSession();
  return mapSession(data.session);
}
