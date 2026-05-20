import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/client";
import { mapSession } from "./session";
import * as authApi from "./api";
import type {
  AuthRole,
  AuthSession,
  AuthStatus,
  AuthUser,
  SignInPayload,
  SignUpPayload,
} from "./types";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  hasRole: (role: AuthRole) => boolean;
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
    const { data } = await supabase.auth.getSession();

    const s = mapSession(data.session);

    setSession(s);
    setStatus(s ? "authenticated" : "unauthenticated");
  };

  sync();

  const { data: listener } = supabase.auth.onAuthStateChange(() => {
    sync();
  });

  return () => {
    listener.subscription.unsubscribe();
  };
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
    (role: AuthRole) => session?.user.role === role,
    [session]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      hasRole,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
    }),
    [status, session, hasRole, signIn, signUp, signOut, requestPasswordReset]
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