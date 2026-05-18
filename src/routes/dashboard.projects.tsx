import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  PlusCircle,
  Search,
  User2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { clientProjects, type ClientProject } from "@/lib/site";
import { StatusBadge } from "@/components/app/StatusBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

const filters = ["all", "pending", "in progress", "completed"] as const;
type FilterKey = (typeof filters)[number];

function ProjectsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ClientProject>(clientProjects[0]);

  const filtered = useMemo(
    () =>
      clientProjects.filter(
        (p) =>
          (filter === "all" || p.status === filter) &&
          (query === "" ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.client.toLowerCase().includes(query.toLowerCase())),
      ),
    [filter, query],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track every engagement, from kickoff to launch.
          </p>
        </div>
        <Link
          to="/dashboard/requests"
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary"
        >
          <PlusCircle className="h-4 w-4" /> New Project Request
        </Link>
      </header>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, clients..."
            className="w-full h-9 pl-9 pr-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md bg-white/5 p-1 border border-border/60">
          <Filter className="h-3.5 w-3.5 text-muted-foreground mx-2" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "h-7 px-3 rounded-sm text-xs capitalize transition-colors",
                filter === f
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => setActive(p)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "w-full text-left glass rounded-2xl p-5 transition-all hover:bg-white/[0.06]",
                active.id === p.id && "ring-1 ring-brand-blue/50",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium truncate">{p.name}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.client} • {p.category}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {p.progress}%
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {p.due}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User2 className="h-3 w-3" /> {p.lead}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {p.updated}
                </span>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No projects match your filters.
            </div>
          )}
        </div>

        {/* Detail */}
        <motion.aside
          key={active.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-5 h-fit lg:sticky lg:top-20"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {active.category}
              </div>
              <h2 className="mt-1 text-lg font-semibold">{active.name}</h2>
              <div className="text-xs text-muted-foreground">{active.client}</div>
            </div>
            <StatusBadge status={active.status} />
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{active.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                key={active.id + "bar"}
                initial={{ width: 0 }}
                animate={{ width: `${active.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <Meta label="Lead" value={active.lead} />
            <Meta label="Due" value={active.due} />
            <Meta label="Last update" value={active.updated} />
            <Meta label="Status" value={active.status} className="capitalize" />
          </div>

          <div className="mt-6">
            <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Timeline
            </div>
            <ol className="relative border-l border-white/10 pl-5 space-y-4">
              {[
                { t: "Kickoff & discovery", d: "Apr 04", done: true },
                { t: "Design system & wireframes", d: "Apr 18", done: true },
                { t: "Sprint 1 — auth + core", d: "May 02", done: active.progress > 30 },
                { t: "Sprint 2 — features", d: "May 18", done: active.progress > 60 },
                { t: "QA & UAT", d: "Jun 02", done: active.progress > 85 },
                { t: "Production launch", d: active.due, done: active.status === "completed" },
              ].map((s) => (
                <li key={s.t} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[27px] top-0.5 h-3 w-3 rounded-full border-2",
                      s.done
                        ? "bg-brand-cyan border-brand-cyan"
                        : "bg-background border-white/20",
                    )}
                  />
                  <div className="text-sm flex items-center gap-2">
                    {s.t}
                    {s.done && <CheckCircle2 className="h-3 w-3 text-brand-cyan" />}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{s.d}</div>
                </li>
              ))}
            </ol>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1 text-sm", className)}>{value}</div>
    </div>
  );
}
