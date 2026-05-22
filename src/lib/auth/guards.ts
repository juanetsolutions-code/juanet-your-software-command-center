/**
 * Route guards usable from TanStack Router `beforeLoad`.
 *
 * On the server (SSR / prerender) we skip redirects and let the hydrated
 * client re-run the guard with the restored Supabase session.
 */
import { redirect } from "@tanstack/react-router";
import { readSession, waitForSessionInit } from "./store";
import type { AuthRole } from "./types";
import { getDefaultPortalPath, hasRoleAccess } from "./roles";

interface GuardOpts {
  redirectTo?: string;
}

export async function requireAuth(currentHref: string, opts: GuardOpts = {}) {
  if (typeof window === "undefined") return;
  await waitForSessionInit();
  const session = readSession();
  if (!session) {
    throw redirect({
      to: opts.redirectTo ?? "/auth/login",
      search: { redirect: currentHref },
    });
  }
  return session;
}

export async function requireRole(role: AuthRole, currentHref: string) {
  if (typeof window === "undefined") return;
  await waitForSessionInit();
  const session = readSession();
  if (!session) {
    throw redirect({ to: "/auth/login", search: { redirect: currentHref } });
  }
  if (!hasRoleAccess(session.user.role, role)) {
    throw redirect({
      to: getDefaultPortalPath(session.user.role),
    });
  }
  return session;
}
