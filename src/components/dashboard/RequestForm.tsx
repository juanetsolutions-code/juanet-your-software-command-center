import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, DollarSign, Send, Sparkles } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { services } from "@/lib/site";
import type { ServiceRequestDraft } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

export interface RequestFormProps {
  budgetRanges: string[];
  timelineOptions: string[];
  onSubmit: (draft: ServiceRequestDraft) => { id: string };
}

export function RequestForm({
  budgetRanges,
  timelineOptions,
  onSubmit,
}: RequestFormProps) {
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceSlug, setServiceSlug] = useState(services[0].slug);
  const [budget, setBudget] = useState(budgetRanges[1] ?? budgetRanges[0]);
  const [timeline, setTimeline] = useState(timelineOptions[1] ?? timelineOptions[0]);
  const [deadline, setDeadline] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = onSubmit({
      title,
      description,
      serviceSlug,
      budgetRange: budget,
      timeline,
      deadlineAt: deadline ? new Date(deadline).toISOString() : null,
    });
    setSubmitted(result);
  }

  function resetForm() {
    setSubmitted(null);
    setTitle("");
    setDescription("");
    setDeadline("");
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                    onClick={() => setServiceSlug(s.slug)}
                    className={cn(
                      "px-3 py-2 rounded-md text-xs border text-left transition-colors",
                      serviceSlug === s.slug
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe goals, users, must-have features, and any constraints..."
                className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60 resize-none"
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Budget range">
                <div className="grid grid-cols-2 gap-2">
                  {budgetRanges.map((b) => (
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
                  {timelineOptions.map((t) => (
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
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
              Your request <span className="text-foreground">#{submitted.id}</span> is in.
              A solution architect will reach out within 24 hours with scope and pricing.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={resetForm}
                className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
              >
                Submit another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </div>
      {children}
    </label>
  );
}
