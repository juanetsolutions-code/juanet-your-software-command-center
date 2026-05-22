import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { readSession } from "@/lib/auth/store";
import { getDefaultPortalPath } from "@/lib/auth/roles";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/auth/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (typeof window === "undefined") return;
    const s = readSession();
    if (s) {
      throw redirect({ to: search.redirect ?? getDefaultPortalPath(s.user.role) });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await signIn({ email, password });
    setPending(false);
    if (!res.ok || !res.session) {
      setError(res.error ?? "Unable to sign in.");
      return;
    }
    const dest = redirectTo ?? getDefaultPortalPath(res.session.user.role);
    navigate({ to: dest });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gradient">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your Juanet control center.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          required
        />
        <Field
          icon={<Lock className="h-4 w-4" />}
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          trailing={
            <Link to="/auth/forgot" className="text-xs text-muted-foreground hover:text-brand-cyan">
              Forgot?
            </Link>
          }
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground"
          >
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full h-10 rounded-md bg-gradient-to-r from-brand-cyan to-brand-violet text-primary-foreground font-medium text-sm hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/auth/signup" className="text-brand-cyan hover:underline">
          Create one
        </Link>
      </div>
    </div>
  );
}

export function Field({
  icon,
  label,
  trailing,
  value,
  onChange,
  ...rest
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {trailing}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          {...rest}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-md bg-white/5 border border-border/60 text-sm placeholder:text-muted-foreground/60 outline-none focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20 transition"
        />
      </div>
    </label>
  );
}
