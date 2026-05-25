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

// New standardized utilities for production repositories

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelay = options.baseDelayMs ?? 100;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

export function buildPaginationMeta(total: number, page: number, pageSize: number) {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export function applyOptimisticUpdate<T extends Record<string, any>>(
  current: T,
  updates: Partial<T>,
): T {
  return { ...current, ...updates, updated_at: new Date().toISOString() } as T;
}
