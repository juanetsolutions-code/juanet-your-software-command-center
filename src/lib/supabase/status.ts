import { SUPABASE_READY as CLIENT_READY } from "./client";

/**
 * Centralized Supabase readiness check.
 * Used by repositories to decide between real DB and mock fallback.
 */
export const SUPABASE_READY = CLIENT_READY;

export function hasSupabaseConfig(): boolean {
  return SUPABASE_READY;
}
