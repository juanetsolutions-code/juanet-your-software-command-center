/**
 * Shared repository utilities for safe Supabase access.
 */

import { logger } from "@/lib/utils/logger";

export function handleSupabaseError(err: unknown, context: string): void {
  logger.warn(`[Supabase] ${context} failed. Falling back to mock data.`, err);
}

export function safeSelect<T>(data: T[] | null | undefined): T[] {
  return data ?? [];
}

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
