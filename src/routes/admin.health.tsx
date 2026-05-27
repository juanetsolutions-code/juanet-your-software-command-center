import { createFileRoute } from "@tanstack/react-router";
import { Activity, Cpu, Database, Globe, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/health")({
  component: AdminHealthPage,
});

const services = [
  { name: "API Gateway", status: "operational", latency: "42ms", uptime: "99.99%" },
  { name: "Database", status: "operational", latency: "12ms", uptime: "99.99%" },
  { name: "Auth Service", status: "operational", latency: "28ms", uptime: "99.98%" },
  { name: "File Storage", status: "degraded", latency: "156ms", uptime: "98.2%" },
  { name: "AI Workers", status: "operational", latency: "89ms", uptime: "99.95%" },
  { name: "Email Service", status: "operational", latency: "67ms", uptime: "99.97%" },
];

function AdminHealthPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Platform Health</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time status of all infrastructure services.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Services online" value="5/6" delta="98% healthy" icon={Activity} />
        <StatCard
          label="Avg. latency"
          value="68ms"
          delta="Last 24h"
          icon={Cpu}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="API requests"
          value="1.2M"
          delta="Today"
          icon={Globe}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Error rate"
          value="0.02%"
          delta="Within SLA"
          icon={AlertCircle}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Service status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Service</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Latency</th>
                <th className="py-2 font-medium">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {services.map((s) => (
                <tr key={s.name} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {s.status === "operational" ? (
                        <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span
                        className={`text-[10px] uppercase tracking-wider ${
                          s.status === "operational" ? "text-brand-cyan" : "text-destructive"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{s.latency}</td>
                  <td className="py-3 text-muted-foreground">{s.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Incidents</h2>
        <p className="text-sm text-muted-foreground">No incidents reported in the last 30 days.</p>
      </div>
    </div>
  );
}
