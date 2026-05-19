export type AuthRole = "admin" | "client";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: AuthRole;
  avatarUrl?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  role?: AuthRole;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  session?: AuthSession;
}
