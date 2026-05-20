/**
 * Auth API — Supabase-ready wrapper with mock fallback.
 *
 * When Supabase env vars are present, real calls are attempted.
 * Otherwise falls back to existing mock behavior.
 */
import type {
  AuthResult,
  AuthRole,
  AuthSession,
  AuthUser,
  SignInPayload,
  SignUpPayload,
} from "./types";
import { clearSession, writeSession } from "./store";
import { supabase, SUPABASE_READY } from "@/lib/supabase/client";
import { mapSession } from "./session";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function deriveRole(email: string, fallback: AuthRole = "client"): AuthRole {
  const e = email.trim().toLowerCase();
  if (e.startsWith("admin")) return "admin";
  if (e.includes("+admin")) return "admin";
  if (e === "client@juanet.io") return "client";
  return fallback;
}

function fullNameFromEmail(email: string): string {
  const handle = email.split("@")[0] ?? "User";
  return handle
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function createMockSession(user: AuthUser): AuthSession {
  return {
    user,
    accessToken: `mock.${user.id}.${Date.now()}`,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

// ---------- Real Supabase implementations (when ready) ----------

export async function signIn(payload: SignInPayload): Promise<AuthResult> {
  const email = payload.email.trim().toLowerCase();
  if (!email || !payload.password) {
    return delay({ ok: false, error: "Email and password are required." });
  }

  // TODO: Replace with real Supabase call when auth is wired
  if (SUPABASE_READY) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: payload.password,
    });
    if (error) return { ok: false, error: error.message };
    const session = mapSession(data.session);
    if (session) writeSession(session);
    return { ok: true, session: session ?? undefined };
  }

  // Mock fallback (current behavior)
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return delay({ ok: false, error: "Enter a valid email address." });
  }
  if (payload.password.length < 6) {
    return delay({ ok: false, error: "Password must be at least 6 characters." });
  }
  const role = deriveRole(email);
  const user: AuthUser = {
    id: `usr_${btoa(email).slice(0, 10)}`,
    email,
    fullName: fullNameFromEmail(email),
    role,
  };
  const session = createMockSession(user);
  writeSession(session);
  return delay({ ok: true, session });
}

export async function signUp(payload: SignUpPayload): Promise<AuthResult> {
  const email = payload.email.trim().toLowerCase();
  if (!email || !payload.password || !payload.fullName) {
    return delay({ ok: false, error: "All fields are required." });
  }

  // TODO: Replace with real Supabase call
  if (SUPABASE_READY) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: payload.password,
      options: {
        data: { full_name: payload.fullName, role: payload.role ?? "client" },
      },
    });
    if (error) return { ok: false, error: error.message };
    const session = mapSession(data.session);
    if (session) writeSession(session);
    return { ok: true, session: session ?? undefined };
  }

  if (payload.password.length < 8) {
    return delay({ ok: false, error: "Password must be at least 8 characters." });
  }
  const role = payload.role ?? deriveRole(email);
  const user: AuthUser = {
    id: `usr_${btoa(email).slice(0, 10)}`,
    email,
    fullName: payload.fullName.trim(),
    role,
  };
  const session = createMockSession(user);
  writeSession(session);
  return delay({ ok: true, session });
}

export async function signOut(): Promise<void> {
  if (SUPABASE_READY) {
    await supabase.auth.signOut();
  }
  clearSession();
  return delay(undefined, 200);
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return delay({ ok: false, error: "Enter a valid email address." });
  }

  if (SUPABASE_READY) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  return delay({ ok: true });
}
