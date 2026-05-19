/**
 * Server-side Supabase clients — PLACEHOLDERS.
 *
 * These wrappers will eventually proxy to:
 *   - `@/integrations/supabase/auth-middleware` for user-scoped server fns
 *   - `@/integrations/supabase/client.server`   for trusted admin work
 *
 * Until Lovable Cloud is enabled, both factories return a Proxy that
 * throws on access, guaranteeing no silent bypass of the mock layer.
 *
 * IMPORTANT: never import this module from client-bundled code. It is
 * referenced only by `createServerFn` handlers and server routes.
 */

type AnySupabase = {
  from: (table: string) => unknown;
  auth: unknown;
  storage: unknown;
};

function notConfigured(label: string): never {
  throw new Error(
    `[supabase:${label}] Server client is not configured yet. ` +
      "Enable Lovable Cloud and swap this placeholder for the generated clients.",
  );
}

function placeholder(label: string): AnySupabase {
  return new Proxy({} as AnySupabase, {
    get() {
      notConfigured(label);
    },
  });
}

/** User-scoped server client (will respect RLS as the caller). */
export function getRequestSupabase(): AnySupabase {
  return placeholder("request");
}

/** Service-role server client (bypasses RLS — trusted handlers only). */
export function getAdminSupabase(): AnySupabase {
  return placeholder("admin");
}
