import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onSessionChange, readSession, waitForSessionInit, isSessionReady } from "./store";
import * as authApi from "./api";
import type {
  AuthRole,
  AuthSession,
  AuthStatus,
  AuthUser,
  SignInPayload,
  SignUpPayload,
} from "./types";
import { hasAnyRoleAccess, hasPermission, type AuthPermission } from "./roles";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  hasRole: (role: AuthRole) => boolean;
  hasAnyRole: (roles: AuthRole[]) => boolean;
  hasPermission: (permission: AuthPermission) => boolean;
  signIn: (p: SignInPayload) => ReturnType<typeof authApi.signIn>;
  signUp: (p: SignUpPayload) => ReturnType<typeof authApi.signUp>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => ReturnType<typeof authApi.requestPasswordReset>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const sync = async () => {
      if (!isSessionReady()) {
        setStatus("loading");
        await waitForSessionInit();
      }
      const s = readSession();
      setSession(s);
      setStatus(s ? "authenticated" : "unauthenticated");
    };

    void sync();
    return onSessionChange(sync);
  }, []);

  const signOut = useCallback(async () => {
    return authApi.signOut();
  }, []);

  const signIn = useCallback((p: SignInPayload) => {
    return authApi.signIn(p);
  }, []);

  const signUp = useCallback((p: SignUpPayload) => {
    return authApi.signUp(p);
  }, []);

  const requestPasswordReset = useCallback((email: string) => {
    return authApi.requestPasswordReset(email);
  }, []);

  const hasRole = useCallback(
    (role: AuthRole) => (session ? hasAnyRoleAccess(session.user.role, [role]) : false),
    [session]
  );

  const hasAnyRole = useCallback(
    (roles: AuthRole[]) => (session ? hasAnyRoleAccess(session.user.role, roles) : false),
    [session]
  );

  const can = useCallback(
    (permission: AuthPermission) => (session ? hasPermission(session.user.role, permission) : false),
    [session]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      hasRole,
      hasAnyRole,
      hasPermission: can,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
    }),
    [status, session, hasRole, hasAnyRole, can, signIn, signUp, signOut, requestPasswordReset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function useRequireRole(role: AuthRole): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}