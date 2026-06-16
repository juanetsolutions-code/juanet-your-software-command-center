import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, PlusCircle, Search, Pencil, Trash2, Inbox } from "lucide-react";
import { useMemo, useState, useEffect, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectDetailPanel } from "@/components/dashboard/ProjectDetailPanel";
import { listProjectTimeline, type Project } from "@/lib/dashboard";
import {
  listMyProjects,
  listMyRequests,
  updateRequest,
  deleteRequest,
  type ClientProject,
  type ClientRequest,
} from "@/lib/client-dashboard";
import { StatusBadge } from "@/components/app/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

const filters = ["all", "pending", "in progress", "completed"] as const;
type FilterKey = (typeof filters)[number];

function mapToProject(p: ClientProject): Project {
  return {
    id: p.id,
    name: p.title,
    client: "—",
    category: p.category ?? "General",
    status: (p.status as Project["status"]) ?? "pending",
    progress: p.progress,
    dueAt: p.dueAt ?? new Date().toISOString(),
    dueLabel: p.dueAt ? new Date(p.dueAt).toLocaleDateString() : "—",
    leadName: p.leadName ?? "—",
    updatedLabel: new Date(p.updatedAt).toLocaleDateString(),
  };
}

function ProjectsPage() {
  const { data: rawProjects = [], isLoading } = useQuery({
    queryKey: ["my-projects"],
    queryFn: listMyProjects,
  });
  const projects = useMemo(() => rawProjects.map(mapToProject), [rawProjects]);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId && projects.length > 0) setActiveId(projects[0].id);
  }, [activeId, projects]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (filter === "all" || p.status === filter) &&
          (query === "" || p.name.toLowerCase().includes(query.toLowerCase())),
      ),
    [projects, filter, query],
  );

  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const timeline = useMemo(() => (active ? listProjectTimeline(active) : []), [active]);

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
            placeholder="Search projects..."
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

      {isLoading ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
          Loading projects…
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground">No projects yet.</p>
          <Link
            to="/dashboard/requests"
            className="mt-4 inline-block text-xs text-brand-cyan hover:underline"
          >
            Submit your first request →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                active={active?.id === p.id}
                onSelect={(proj) => setActiveId(proj.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
                No projects match your filters.
              </div>
            )}
          </div>

          {active && <ProjectDetailPanel project={active} timeline={timeline} />}
        </div>
      )}

      <RequestedProjectsSection />
    </div>
  );
}

function RequestedProjectsSection() {
  const qc = useQueryClient();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: listMyRequests,
  });
  const [editing, setEditing] = useState<ClientRequest | null>(null);

  const del = useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      toast.success("Request deleted");
      qc.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Inbox className="h-4 w-4 text-brand-cyan" /> Requested projects
          </h2>
          <p className="text-xs text-muted-foreground">
            Projects you've requested. Edit while still pending.
          </p>
        </div>
        <Link
          to="/dashboard/requests"
          className="text-xs text-brand-cyan hover:underline"
        >
          + New request
        </Link>
      </div>

      {isLoading ? (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">Loading…</div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
          No requested projects yet.
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="px-4 py-2 font-medium">Subject</th>
                <th className="px-4 py-2 font-medium">Budget</th>
                <th className="px-4 py-2 font-medium">Timeline</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Submitted</th>
                <th className="px-4 py-2 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium">{r.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.budgetRange ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.timeline ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status as any} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-1">
                    <button
                      onClick={() => setEditing(r)}
                      disabled={r.status !== "pending"}
                      className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"
                      title={r.status === "pending" ? "Edit" : "Locked once in progress"}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this request?")) del.mutate(r.id);
                      }}
                      disabled={r.status !== "pending"}
                      className="p-1.5 rounded hover:bg-white/10 text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditRequestDialog request={editing} onClose={() => setEditing(null)} />
    </section>
  );
}

function EditRequestDialog({
  request,
  onClose,
}: {
  request: ClientRequest | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");

  useEffect(() => {
    if (request) {
      setSubject(request.subject);
      setDescription(request.description ?? "");
      setBudget(request.budgetRange ?? "");
      setTimeline(request.timeline ?? "");
    }
  }, [request]);

  const save = useMutation({
    mutationFn: () =>
      updateRequest(request!.id, {
        subject,
        description,
        budgetRange: budget,
        timeline,
      }),
    onSuccess: () => {
      toast.success("Request updated");
      qc.invalidateQueries({ queryKey: ["my-requests"] });
      onClose();
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim()) return;
    save.mutate();
  }

  return (
    <Dialog open={!!request} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit request</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Subject</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-10 px-3 mt-1 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Budget</label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-10 px-3 mt-1 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Timeline</label>
              <input
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full h-10 px-3 mt-1 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50"
            >
              {save.isPending ? "Saving…" : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

