/**
 * Mock auth API — drop-in replaceable with Supabase Auth.
 *
 * SUPABASE swap-in plan:
 *   signIn  -> supabase.auth.signInWithPassword(...)
 *   signUp  -> supabase.auth.signUp({ ..., options: { emailRedirectTo } })
 *   signOut -> supabase.auth.signOut()
 *   reset   -> supabase.auth.resetPasswordForEmail(email, { redirectTo })
 *
 * Demo accounts (any non-empty password works):
 *   client@juanet.io  -> client role
 *   admin@juanet.io   -> admin role
 *   anything else     -> defaults to client
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

function createSession(user: AuthUser): AuthSession {
  return {
    user,
    accessToken: `mock.${user.id}.${Date.now()}`,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

export async function signIn(payload: SignInPayload): Promise<AuthResult> {
  const email = payload.email.trim().toLowerCase();
  if (!email || !payload.password) {
    return delay({ ok: false, error: "Email and password are required." });
  }
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
  const session = createSession(user);
  writeSession(session);
  return delay({ ok: true, session });
}

export async function signUp(payload: SignUpPayload): Promise<AuthResult> {
  const email = payload.email.trim().toLowerCase();
  if (!email || !payload.password || !payload.fullName) {
    return delay({ ok: false, error: "All fields are required." });
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
  const session = createSession(user);
  writeSession(session);
  return delay({ ok: true, session });
}

export async function signOut(): Promise<void> {
  clearSession();
  return delay(undefined, 200);
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return delay({ ok: false, error: "Enter a valid email address." });
  }
  return delay({ ok: true });
}
