import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, FolderKanban, MessageSquare, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/app/StatCard";
import {
  listMyProjects,
  listMyRequests,
  listMyInvoices,
  listMyNotifications,
} from "@/lib/client-dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { data: projects = [] } = useQuery({
    queryKey: ["my-projects"],
    queryFn: listMyProjects,
  });
  const { data: requests = [] } = useQuery({
    queryKey: ["my-requests"],
    queryFn: listMyRequests,
  });
  const { data: invoices = [] } = useQuery({
    queryKey: ["my-invoices"],
    queryFn: listMyInvoices,
  });
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: listMyNotifications,
  });

  const activeProjects = projects.filter((p) => p.status !== "completed").length;
  const openRequests = requests.filter((r) => r.status !== "completed").length;
  const unread = notifications.filter((n) => !n.read).length;
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "due" || i.status === "overdue")
    .reduce((s, i) => s + i.amount, 0);

  const recent = [
    ...notifications.slice(0, 4).map((n) => ({
      id: n.id,
      text: n.title,
      kind: n.category ?? "notification",
      time: new Date(n.createdAt).toLocaleDateString(),
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening across your engagements.
          </p>
        </div>
        <Link
          to="/dashboard/requests"
          className="h-10 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary"
        >
          + New Request
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard label="Active projects" value={String(activeProjects)} icon={FolderKanban} />
        <StatCard
          label="Open requests"
          value={String(openRequests)}
          icon={Activity}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Unread notifications"
          value={String(unread)}
          icon={MessageSquare}
          accent="from-brand-cyan to-brand-violet"
        />
        <StatCard
          label="Outstanding"
          value={`$${outstanding.toLocaleString()}`}
          icon={Wallet}
          accent="from-brand-violet to-brand-cyan"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Project pipeline</h2>
            <Link
              to="/dashboard/projects"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {projects.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No projects yet.
              </div>
            ) : (
              projects.slice(0, 5).map((p) => (
                <div key={p.id} className="rounded-xl p-4 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{p.title}</div>
                    <span className="text-xs text-muted-foreground capitalize">{p.status}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold">Recent activity</h2>
          {recent.length === 0 ? (
            <div className="mt-6 text-center text-xs text-muted-foreground">No activity yet.</div>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-cyan" />
                  <div className="text-sm flex-1">
                    <div>{a.text}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {a.kind} · {a.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
