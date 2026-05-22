/**
 * Session persistence + hydration layer.
 *
 * Supabase is the single source of truth when configured. Mock localStorage
 * remains as a fallback for non-configured environments.
 */
import type { AuthSession } from "./types";
import { supabase, SUPABASE_READY } from "@/lib/supabase/client";
import { mapSession, mapSessionAsync } from "./session";
import { clearProfileCache } from "./profile";
import { clearOrganizationCache } from "@/lib/tenant/context";

const STORAGE_KEY = "juanet.auth.session";
let currentSession: AuthSession | null = null;
let ready = false;
let initPromise: Promise<AuthSession | null> | null = null;
let subscribed = false;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function readMockSession(): AuthSession | null {
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

async function upgradeSessionWithProfile(rawSession: Parameters<typeof mapSession>[0]) {
  try {
    const enriched = await mapSessionAsync(rawSession);
    currentSession = enriched;
    emitChange();
  } catch {
    /* keep metadata-mapped session */
  }
}

function ensureSupabaseSubscription() {
  if (typeof window === "undefined" || subscribed || !SUPABASE_READY) return;
  subscribed = true;

  supabase.auth.onAuthStateChange((event, session) => {
    currentSession = mapSession(session);
    ready = true;
    if (event === "SIGNED_OUT") {
      clearProfileCache();
      clearOrganizationCache();
    }
    emitChange();
    if (session) void upgradeSessionWithProfile(session);
  });
}

export function isSessionReady(): boolean {
  return ready;
}

export async function waitForSessionInit(): Promise<AuthSession | null> {
  if (typeof window === "undefined") return null;

  if (!SUPABASE_READY) {
    currentSession = readMockSession();
    ready = true;
    return currentSession;
  }

  ensureSupabaseSubscription();
  if (ready) return currentSession;
  if (initPromise) return initPromise;

  initPromise = supabase.auth
    .getSession()
    .then(({ data }) => {
      currentSession = mapSession(data.session);
      ready = true;
      emitChange();
      if (data.session) void upgradeSessionWithProfile(data.session);
      return currentSession;
    })
    .catch(() => {
      currentSession = null;
      ready = true;
      emitChange();
      return null;
    })
    .finally(() => {
      initPromise = null;
    });

  return initPromise;
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  void waitForSessionInit();
  return currentSession;
}

export function writeSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  currentSession = session;
  ready = true;
  if (!SUPABASE_READY) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  emitChange();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  currentSession = null;
  ready = true;
  window.localStorage.removeItem(STORAGE_KEY);
  emitChange();
}

export function onSessionChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  void waitForSessionInit();
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
