import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onSessionChange, readSession } from "./store";
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
    const sync = () => {
      const s = readSession();
      setSession(s);
      setStatus(s ? "authenticated" : "unauthenticated");
    };
    sync();
    return onSessionChange(sync);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      hasRole: (role) => session?.user.role === role,
      signIn: authApi.signIn,
      signUp: authApi.signUp,
      signOut: useCallbackBound(authApi.signOut),
      requestPasswordReset: authApi.requestPasswordReset,
    }),
    [status, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useCallbackBound<T extends (...a: never[]) => unknown>(fn: T): T {
  return useCallback(((...args: never[]) => fn(...args)) as T, [fn]);
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
