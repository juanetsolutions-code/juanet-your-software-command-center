import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated backdrop */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 45%, transparent), transparent 70%)" }}
        animate={{ x: [0, 60, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--brand-violet) 40%, transparent), transparent 70%)" }}
        animate={{ x: [0, -40, 30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 group">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-violet">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Juanet<span className="text-brand-cyan">.</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="glass-strong rounded-2xl p-8 ring-soft"
        >
          <Outlet />
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by Juanet · Demo auth (any password). Use{" "}
          <code className="text-brand-cyan">admin@juanet.io</code> for admin.
        </p>
      </div>
    </div>
  );
}
