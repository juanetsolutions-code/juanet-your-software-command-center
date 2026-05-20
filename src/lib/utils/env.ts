/**
 * Typed, runtime-safe environment variable accessors.
 *
 * - Browser code reads `import.meta.env.VITE_*` (inlined by Vite at build).
 * - Server code reads `process.env.*` (or VITE_* mirror) lazily at call time
 *   so Cloudflare Workers' per-request env injection works correctly.
 *
 * Never read secrets at module scope from a file that can be imported by
 * client bundles — use the getters here.
 */

const IS_BROWSER = typeof window !== "undefined";

function readProcessEnv(name: string): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

function readViteEnv(name: string): string | undefined {
  try {
    const v = (import.meta as { env?: Record<string, string | undefined> }).env?.[name];
    return v && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

/** Public Supabase URL (safe to expose to browser). */
export function getSupabaseUrl(): string | undefined {
  return readViteEnv("VITE_SUPABASE_URL") ?? readProcessEnv("SUPABASE_URL");
}

/** Public Supabase anon/publishable key. */
export function getSupabaseAnonKey(): string | undefined {
  return (
    readViteEnv("VITE_SUPABASE_ANON_KEY") ??
    readViteEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ??
    readProcessEnv("SUPABASE_ANON_KEY") ??
    readProcessEnv("SUPABASE_PUBLISHABLE_KEY")
  );
}

/** Server-only service role key. Never call from browser code. */
export function getSupabaseServiceRoleKey(): string | undefined {
  if (IS_BROWSER) {
    // Guardrail: must never be referenced in the client bundle.
    return undefined;
  }
  return readProcessEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export const IS_DEV =
  readViteEnv("DEV") === "true" || readViteEnv("MODE") === "development";
