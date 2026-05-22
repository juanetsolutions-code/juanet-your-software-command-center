import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/utils/env";
import { createSecureContext, getSecureContext } from "@/lib/security/secure-context";
import { logger } from "@/lib/utils/logger";

let requestClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "public-anon-key";

/**
 * Server-side Supabase client for TanStack Start.
 * Accepts optional access token for user-scoped RLS.
 *
 * Env is read lazily inside the function so Cloudflare Workers'
 * per-request env injection works correctly.
 */
export function getRequestSupabase(accessToken?: string): SupabaseClient {
  if (requestClient && !accessToken) return requestClient;

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    return createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
  }

  const client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });

  if (!accessToken) requestClient = client;
  return client;
}

/**
 * Server-only admin client using the service role key. BYPASSES RLS.
 * Returns a placeholder client when credentials are not configured so
 * callers can still type-check; calls will simply fail at runtime.
 */
export function getAdminSupabase(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();

  if (!url || !serviceKey) {
    return createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
  }

  adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

/**
 * Production security helpers
 */
export function getSecureRequestSupabase(accessToken?: string) {
  const ctx = createSecureContext();
  const client = getRequestSupabase(accessToken);

  // Lightweight request fingerprint for audit
  const fingerprint = `${ctx.tenantId ?? "no-tenant"}:${ctx.userId ?? "anon"}`;

  logger.info(`[Supabase] Secure client created with fingerprint: ${fingerprint}`);

  return client;
}

export function validateSessionForTenant(requiredTenantId?: string): boolean {
  const ctx = getSecureContext();
  if (!requiredTenantId) return true;
  return ctx.tenantId === requiredTenantId;
}

export function getRequestFingerprint(): string {
  const ctx = getSecureContext();
  return `${ctx.tenantId ?? "global"}:${ctx.userId ?? "anonymous"}`;
}
