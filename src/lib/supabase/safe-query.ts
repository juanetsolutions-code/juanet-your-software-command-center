/**
 * Centralized Supabase query helpers.
 *
 * Each helper wraps a Supabase call with:
 *   - typed result envelopes
 *   - safe error handling (never throws to UI)
 *   - consistent logging
 *
 * Repositories MUST use these instead of calling supabase directly so the
 * mock fallback contract stays uniform across the codebase.
 */

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/utils/logger";

export interface SafeResult<T> {
  data: T | null;
  error: PostgrestError | Error | null;
  ok: boolean;
}

export function handleSupabaseError(err: unknown, context: string): void {
  logger.warn(`[Supabase] ${context} failed. Falling back where applicable.`, err);
}

export function safeSelect<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : [];
}

export function safeSingle<T>(data: T | null | undefined): T | null {
  return data ?? null;
}

/**
 * Wraps a thenable Supabase query builder and normalizes the result.
 */
export async function runSafe<T>(
  context: string,
  query: PromiseLike<{ data: T | null; error: PostgrestError | null }>,
): Promise<SafeResult<T>> {
  const start = Date.now();
  try {
    const { data, error } = await query;
    const duration = Date.now() - start;
    if (error) {
      handleSupabaseError(error, context);
      logger.info(`[Supabase] ${context} failed after ${duration}ms (fallback active)`);
      return { data: null, error, ok: false };
    }
    logger.info(`[Supabase] ${context} ok in ${duration}ms`);
    return { data, error: null, ok: true };
  } catch (err) {
    const duration = Date.now() - start;
    handleSupabaseError(err, context);
    logger.info(`[Supabase] ${context} error after ${duration}ms`);
    return { data: null, error: err as Error, ok: false };
  }
}

/**
 * Typed select returning an array (never throws).
 */
export async function safeSelectFrom<Row>(
  client: SupabaseClient,
  context: string,
  build: (c: SupabaseClient) => PromiseLike<{ data: Row[] | null; error: PostgrestError | null }>,
): Promise<Row[]> {
  const res = await runSafe<Row[]>(context, build(client));
  return safeSelect(res.data);
}

/**
 * Typed insert returning the inserted row or null on failure.
 */
export async function safeInsert<Row>(
  client: SupabaseClient,
  context: string,
  table: string,
  values: Record<string, unknown> | Record<string, unknown>[],
): Promise<Row | null> {
  const res = await runSafe<Row>(
    context,
    client.from(table).insert(values).select().single() as unknown as PromiseLike<{
      data: Row | null;
      error: PostgrestError | null;
    }>,
  );
  return safeSingle(res.data);
}

/**
 * Typed update returning the updated row or null on failure.
 */
export async function safeUpdate<Row>(
  client: SupabaseClient,
  context: string,
  table: string,
  values: Record<string, unknown>,
  match: Record<string, unknown>,
): Promise<Row | null> {
  let q = client.from(table).update(values);
  for (const [k, v] of Object.entries(match)) {
    q = q.eq(k, v);
  }
  const res = await runSafe<Row>(
    context,
    q.select().single() as unknown as PromiseLike<{
      data: Row | null;
      error: PostgrestError | null;
    }>,
  );
  return safeSingle(res.data);
}
