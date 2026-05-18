import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  DollarSign,
  FileText,
  Inbox,
  Send,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { services } from "@/lib/site";
import { StatusBadge } from "@/components/app/StatusBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/requests")({
  component: RequestsPage,
});

const budgets = ["< $5k", "$5k – $15k", "$15k – $50k", "$50k+"];
const timelines = ["< 1 month", "1–3 months", "3–6 months", "6+ months"];

const recent = [
  { id: "RQ-204", title: "Internal HR portal", status: "in progress" as const, date: "May 14" },
  { id: "RQ-203", title: "Stripe + M-Pesa checkout", status: "pending" as const, date: "May 10" },
  { id: "RQ-202", title: "Marketing site redesign", status: "completed" as const, date: "Apr 30" },
];

function RequestsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState(services[0].slug);
  const [budget, setBudget] = useState(budgets[1]);
  const [timeline, setTimeline] = useState(timelines[1]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Request a service
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us what you're building. We'll scope it within 24 hours.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="relative space-y-6"
              >
                <Field label="Project name">
                  <input
                    required
                    placeholder="e.g. Internal Operations Portal"
                    className="w-full h-11 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60"
                  />
                </Field>

                <Field label="Service type">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {services.slice(0, 6).map((s) => (
                      <button
                        type="button"
                        key={s.slug}
                        onClick={() => setService(s.slug)}
                        className={cn(
                          "px-3 py-2 rounded-md text-xs border text-left transition-colors",
                          service === s.slug
                            ? "border-brand-blue/60 bg-brand-blue/10 text-foreground"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Description">
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe goals, users, must-have features, and any constraints..."
                    className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60 resize-none"
                  />
                </Field>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Budget range">
                    <div className="grid grid-cols-2 gap-2">
                      {budgets.map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={cn(
                            "h-10 rounded-md text-xs border transition-colors inline-flex items-center justify-center gap-1.5",
                            budget === b
                              ? "border-brand-blue/60 bg-brand-blue/10"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <DollarSign className="h-3 w-3" />
                          {b}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Timeline">
                    <div className="grid grid-cols-2 gap-2">
                      {timelines.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setTimeline(t)}
                          className={cn(
                            "h-10 rounded-md text-xs border transition-colors",
                            timeline === t
                              ? "border-brand-blue/60 bg-brand-blue/10"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                <Field label="Deadline (optional)">
                  <input
                    type="date"
                    className="w-full h-11 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60"
                  />
                </Field>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
                    Avg. response in under 24h
                  </div>
                  <button
                    type="submit"
                    className="h-11 px-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary"
                  >
                    <Send className="h-4 w-4" /> Submit request
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative text-center py-10"
              >
                <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet glow-primary">
                  <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">Request submitted</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Your request <span className="text-foreground">#RQ-205</span> is in.
                  A solution architect will reach out within 24 hours with scope and pricing.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
                  >
                    Submit another
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Inbox className="h-4 w-4 text-brand-cyan" /> Your recent requests
            </div>
            <ul className="mt-4 space-y-3">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-white/5 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-1 text-sm">{r.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Submitted {r.date}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-brand-cyan" /> What happens next
            </div>
            <ol className="mt-4 space-y-3 text-xs text-muted-foreground">
              {[
                "Architect review & scoping call",
                "Detailed proposal with milestones",
                "Contract + kickoff in your workspace",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="h-5 w-5 shrink-0 grid place-items-center rounded-full bg-brand-blue/15 text-brand-cyan text-[10px] font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </div>
      {children}
    </label>
  );
}
