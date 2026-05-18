import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, PlayCircle, Activity, Zap, Database, GitBranch } from "lucide-react";
import { site, stats } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative pt-36 md:pt-44 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-brand-blue/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-[500px] h-[400px] rounded-full bg-brand-violet/20 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full text-xs font-medium glass">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
            Now onboarding Q3 partners
            <ArrowRight className="h-3 w-3" />
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-gradient">
            {site.tagline}
          </h1>

          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {site.description}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 h-12 px-6 rounded-lg font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary hover:opacity-95 transition"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg font-medium glass hover:bg-white/5 transition"
            >
              <PlayCircle className="h-4 w-4" />
              Explore Portfolio
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-16 md:mt-20"
        >
          <DashboardMock />
        </motion.div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center">
              <div className="text-2xl md:text-3xl font-semibold text-gradient-brand">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-cyan/40 via-brand-blue/30 to-brand-violet/40 blur-2xl opacity-60 animate-pulse-glow" />
      <div className="relative glass-strong rounded-2xl overflow-hidden ring-soft">
        <div className="flex items-center gap-2 px-4 h-10 border-b border-border/60">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-muted-foreground">juanet.app / overview</span>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4">
          <aside className="hidden md:flex col-span-3 flex-col gap-1 p-2 rounded-lg bg-black/20 border border-border/60">
            {[
              { i: Activity, l: "Overview", a: true },
              { i: GitBranch, l: "Projects" },
              { i: Database, l: "Systems" },
              { i: Zap, l: "Automations" },
            ].map(({ i: Icon, l, a }) => (
              <div
                key={l}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-xs ${
                  a ? "bg-white/5 text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {l}
              </div>
            ))}
          </aside>

          <div className="col-span-12 md:col-span-9 grid grid-cols-3 gap-3">
            {[
              { l: "MRR", v: "$48.2K", c: "from-brand-cyan to-brand-blue" },
              { l: "Active Projects", v: "23", c: "from-brand-blue to-brand-violet" },
              { l: "SLA Uptime", v: "99.99%", c: "from-brand-violet to-brand-cyan" },
            ].map((k) => (
              <div key={k.l} className="rounded-lg p-3 bg-black/20 border border-border/60">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
                <div className={`mt-1 text-lg font-semibold bg-gradient-to-r ${k.c} bg-clip-text text-transparent`}>
                  {k.v}
                </div>
                <div className="mt-2 h-10 flex items-end gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm bg-gradient-to-t ${k.c} opacity-80`}
                      style={{ height: `${20 + ((i * 13) % 70)}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="col-span-3 rounded-lg p-3 bg-black/20 border border-border/60">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium">Deployment Pipeline</div>
                <div className="text-[10px] text-brand-cyan flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" /> Live
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {["atlas-core • build #482", "meditrack-api • deploy #211", "skyline-lms • migrate #88"].map((s, i) => (
                  <div key={s} className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground w-56 truncate">{s}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet animate-shimmer"
                        style={{ width: `${[78, 54, 92][i]}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{[78, 54, 92][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
