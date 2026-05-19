/**
 * Session persistence layer.
 *
 * Currently backed by localStorage with a mock JWT. When Supabase Auth is
 * wired in, swap this file's implementation for `supabase.auth.getSession()`
 * / `onAuthStateChange` — the call sites (context + guards) do not change.
 */
import type { AuthSession } from "./types";

const STORAGE_KEY = "juanet.auth.session";

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.user || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("juanet:auth"));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("juanet:auth"));
}

export function onSessionChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("juanet:auth", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("juanet:auth", handler);
    window.removeEventListener("storage", handler);
  };
}
