import { createFileRoute } from "@tanstack/react-router";
import { Ticket, User, Clock, RefreshCw, ArrowUpRight, Plus } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/support-queue")({
  component: AdminSupportQueuePage,
  head: () => ({
    meta: [
      { title: "Support Queue | Admin Console" },
      { name: "description", content: "Customer support tickets and requests management." },
    ],
  }),
});

const tickets = [
  {
    id: "tk-001",
    subject: "Payment failed for invoice",
    client: "Urban Retail",
    priority: "high",
    status: "open",
    assignee: "Unassigned",
    time: "12m ago",
  },
  {
    id: "tk-002",
    subject: "Need help with API integration",
    client: "Greenfields Co.",
    priority: "medium",
    status: "in-progress",
    assignee: "Marcus",
    time: "1h ago",
  },
  {
    id: "tk-003",
    subject: "License key not working",
    client: "Skyline Academy",
    priority: "low",
    status: "open",
    assignee: "Unassigned",
    time: "3h ago",
  },
  {
    id: "tk-004",
    subject: "Feature request: dark mode",
    client: "Nairobi Health",
    priority: "low",
    status: "open",
    assignee: "Unassigned",
    time: "5h ago",
  },
];

function AdminSupportQueuePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Support Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customer support tickets and requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
            <Plus className="h-4 w-4" /> New ticket
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open tickets" value="24" delta="4 need attention" icon={Ticket} />
        <StatCard
          label="Avg. response"
          value="2.1h"
          delta="Within SLA"
          icon={Clock}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Resolved today"
          value="12"
          delta="+6 from yesterday"
          icon={Ticket}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="CSAT score"
          value="94%"
          delta="Great rating"
          icon={User}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Open tickets</h2>
          <Link
            to="/admin/support-queue"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">ID</th>
                <th className="py-2 font-medium">Subject</th>
                <th className="py-2 font-medium">Client</th>
                <th className="py-2 font-medium">Priority</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Assignee</th>
                <th className="py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-mono text-xs">{t.id}</td>
                  <td className="py-3 font-medium">{t.subject}</td>
                  <td className="py-3 text-muted-foreground">{t.client}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        t.priority === "high"
                          ? "bg-destructive/15 text-destructive"
                          : t.priority === "medium"
                          ? "bg-brand-blue/15 text-brand-blue"
                          : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{t.assignee}</td>
                  <td className="py-3 text-muted-foreground">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}