import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { readSession } from "@/lib/auth/store";
import { getDefaultPortalPath } from "@/lib/auth/roles";
import { Field } from "./auth.login";

export const Route = createFileRoute("/auth/signup")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = readSession();
    if (s) throw redirect({ to: getDefaultPortalPath(s.user.role) });
  },
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await signUp({ fullName, email, password });
    setPending(false);
    if (!res.ok || !res.session) {
      setError(res.error ?? "Unable to create account.");
      return;
    }
    navigate({ to: res.session.user.role === "admin" ? "/admin" : "/dashboard" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gradient">
          Create your workspace
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Spin up your Juanet account in seconds.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          icon={<User className="h-4 w-4" />}
          label="Full name"
          value={fullName}
          onChange={setFullName}
          placeholder="Jane Ndegwa"
          autoComplete="name"
          required
        />
        <Field
          icon={<Mail className="h-4 w-4" />}
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
        <Field
          icon={<Lock className="h-4 w-4" />}
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
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
          {pending ? "Creating account…" : "Create account"}
        </button>

        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
          By continuing you agree to Juanet's Terms of Service and Privacy Policy.
        </p>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Already on Juanet?{" "}
        <Link to="/auth/login" className="text-brand-cyan hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
