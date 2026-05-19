import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Field } from "./_auth.login";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
});

function ForgotPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await requestPasswordReset(email);
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Unable to send reset link.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 py-4"
      >
        <div className="mx-auto h-12 w-12 rounded-full bg-brand-cyan/10 grid place-items-center">
          <CheckCircle2 className="h-6 w-6 text-brand-cyan" />
        </div>
        <h1 className="text-xl font-semibold">Check your inbox</h1>
        <p className="text-sm text-muted-foreground">
          We sent a password reset link to <span className="text-foreground">{email}</span>.
        </p>
        <Link
          to="/auth/login"
          className="inline-block text-xs text-brand-cyan hover:underline"
        >
          Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gradient">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          We'll email you a secure link to set a new password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
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
          {pending ? "Sending link…" : "Send reset link"}
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Remembered it?{" "}
        <Link to="/auth/login" className="text-brand-cyan hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
