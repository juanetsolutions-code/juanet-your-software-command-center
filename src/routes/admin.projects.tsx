import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, Plus, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects | Admin Console" },
      { name: "description", content: "Manage all customer projects and their progress." },
    ],
  }),
});

const projects = [
  {
    id: "p-01",
    name: "Atlas Core",
    client: "Atlas Financial",
    status: "Active",
    progress: 78,
    budget: "$120k",
    spent: "$94k",
  },
  {
    id: "p-02",
    name: "Nairobi Health Portal",
    client: "Nairobi Health",
    status: "Active",
    progress: 45,
    budget: "$45k",
    spent: "$20k",
  },
  {
    id: "p-03",
    name: "Harvest ERP",
    client: "Greenfields Co.",
    status: "Planning",
    progress: 12,
    budget: "$80k",
    spent: "$0k",
  },
];

function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All customer projects and their progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
          >
            Refresh
          </Link>
          <Link
            to="/admin/projects"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
          >
            <Plus className="h-4 w-4" /> New project
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total projects" value="23" delta="6 launching" icon={FolderKanban} />
        <StatCard
          label="Active"
          value="18"
          delta="78% of total"
          icon={FolderKanban}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Avg. progress"
          value="46%"
          delta="On track"
          icon={FolderKanban}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Budget used"
          value="$1.2M"
          delta="This quarter"
          icon={FolderKanban}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">All projects</h2>
          <Link
            to="/admin/projects"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="h-10 w-10" />}
            title="No projects yet"
            description="Create your first project to get started."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Project</th>
                  <th className="py-2 font-medium">Client</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Progress</th>
                  <th className="py-2 font-medium">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.client}</td>
                    <td className="py-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.progress}%</td>
                    <td className="py-3 text-muted-foreground">{p.spent} / {p.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}