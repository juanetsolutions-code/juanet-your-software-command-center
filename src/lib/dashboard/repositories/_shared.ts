/**
 * Shared repository utilities for safe Supabase access.
 * Re-exports centralized safe query helpers to avoid duplication.
 */

export {
  handleSupabaseError,
  safeSelect,
  safeSingle,
  runSafe,
  safeSelectFrom,
  safeInsert,
  safeUpdate,
} from "@/lib/supabase/safe-query";

export function normalizeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : [];
}

export function mapDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
