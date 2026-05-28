import { createFileRoute } from "@tanstack/react-router";
import { FileText, Shield, AlertTriangle, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/audit-center")({
  component: AdminAuditPage,
  head: () => ({
    meta: [
      { title: "Audit Center | Admin Console" },
      { name: "description", content: "Security events and administrative action logs." },
    ],
  }),
});

const auditLogs = [
  {
    id: "a-1",
    user: "admin@juanet.io",
    action: "Deleted user account",
    target: "user-1247",
    time: "2m ago",
    severity: "high",
  },
  {
    id: "a-2",
    user: "admin@juanet.io",
    action: "Updated subscription",
    target: "Atlas Financial",
    time: "15m ago",
    severity: "medium",
  },
  {
    id: "a-3",
    user: "system",
    action: "API rate limit triggered",
    target: "client-key-892",
    time: "1h ago",
    severity: "low",
  },
  {
    id: "a-4",
    user: "admin@juanet.io",
    action: "Generated license key",
    target: "Pulse CRM",
    time: "3h ago",
    severity: "medium",
  },
  {
    id: "a-5",
    user: "system",
    action: "Backup completed",
    target: "daily-backup-2026-05-28",
    time: "6h ago",
    severity: "low",
  },
];

function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Audit Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Security events and administrative actions.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total events" value="4,218" delta="Last 30 days" icon={FileText} />
        <StatCard
          label="High severity"
          value="23"
          delta="Requires review"
          icon={AlertTriangle}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Active admins"
          value="4"
          delta="3 changes today"
          icon={Shield}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Compliance score"
          value="98%"
          delta="Audit ready"
          icon={Shield}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent audit events</h2>
          <Link
            to="/admin/audit-center"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">User</th>
                <th className="py-2 font-medium">Action</th>
                <th className="py-2 font-medium">Target</th>
                <th className="py-2 font-medium">Severity</th>
                <th className="py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{log.user}</td>
                  <td className="py-3 text-muted-foreground">{log.action}</td>
                  <td className="py-3 text-muted-foreground">{log.target}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        log.severity === "high"
                          ? "bg-destructive/15 text-destructive"
                          : log.severity === "medium"
                          ? "bg-brand-blue/15 text-brand-blue"
                          : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}