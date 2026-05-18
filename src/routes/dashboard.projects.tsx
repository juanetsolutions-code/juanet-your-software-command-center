import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectDetailPanel } from "@/components/dashboard/ProjectDetailPanel";
import {
  listProjectTimeline,
  listProjects,
  type Project,
  type ProjectStatus,
} from "@/lib/dashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

const filters = ["all", "pending", "in progress", "completed"] as const;
type FilterKey = (typeof filters)[number];

function matchesFilter(project: Project, filter: FilterKey) {
  if (filter === "all") return true;
  return project.status === (filter satisfies ProjectStatus | "all");
}

function ProjectsPage() {
  const projects = listProjects();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Project>(projects[0]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          matchesFilter(p, filter) &&
          (query === "" ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.client.toLowerCase().includes(query.toLowerCase())),
      ),
    [projects, filter, query],
  );

  const timeline = useMemo(() => listProjectTimeline(active), [active]);

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
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              active={active.id === p.id}
              onSelect={setActive}
            />
          ))}
          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No projects match your filters.
            </div>
          )}
        </div>

        <ProjectDetailPanel project={active} timeline={timeline} />
      </div>
    </div>
  );
}
