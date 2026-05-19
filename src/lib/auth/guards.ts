/**
 * Route guards usable from TanStack Router `beforeLoad`.
 *
 * On the server (SSR / prerender) we cannot read the user's session — the
 * mock store lives in localStorage. We therefore skip the guard server-side
 * and let the client-side re-run handle it. When swapping to Supabase, this
 * is the place to call `supabase.auth.getUser()` for the SSR branch.
 */
import { redirect } from "@tanstack/react-router";
import { readSession } from "./store";
import type { AuthRole } from "./types";

interface GuardOpts {
  redirectTo?: string;
}

export function requireAuth(currentHref: string, opts: GuardOpts = {}) {
  if (typeof window === "undefined") return;
  const session = readSession();
  if (!session) {
    throw redirect({
      to: opts.redirectTo ?? "/auth/login",
      search: { redirect: currentHref },
    });
  }
  return session;
}

export function requireRole(role: AuthRole, currentHref: string) {
  if (typeof window === "undefined") return;
  const session = readSession();
  if (!session) {
    throw redirect({ to: "/auth/login", search: { redirect: currentHref } });
  }
  if (session.user.role !== role) {
    throw redirect({
      to: session.user.role === "admin" ? "/admin" : "/dashboard",
    });
  }
  return session;
}
