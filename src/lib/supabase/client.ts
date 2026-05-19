/**
 * Browser-side Supabase client — PLACEHOLDER.
 *
 * Wiring is deferred until Lovable Cloud is enabled on this project.
 * Until then, importing `supabase` from this module returns a proxy
 * that throws a descriptive error on any property access, making it
 * obvious in dev when something accidentally bypasses the mock layer
 * in `src/lib/dashboard/api.ts`.
 *
 * When Lovable Cloud is enabled, replace the body of `createBrowserClient`
 * with the generated client from `@/integrations/supabase/client` and
 * remove the proxy.
 *
 * Required envs (already documented in the integration guide):
 *   - import.meta.env.VITE_SUPABASE_URL
 *   - import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
 */

type AnySupabase = {
  from: (table: string) => unknown;
  auth: unknown;
  storage: unknown;
};

function notConfigured(): never {
  throw new Error(
    "[supabase] Browser client is not configured yet. " +
      "Enable Lovable Cloud and swap this placeholder for the generated client.",
  );
}

function createBrowserClient(): AnySupabase {
  return new Proxy({} as AnySupabase, {
    get() {
      notConfigured();
    },
  });
}

export const supabase = createBrowserClient();

/** Feature flag the API layer can read before deciding mock vs live. */
export const SUPABASE_READY = false;
