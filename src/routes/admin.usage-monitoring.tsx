import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/usage-monitoring")({
  component: AdminUsageMonitoringPage,
  head: () => ({
    meta: [
      { title: "Usage Monitoring | Admin Console" },
      { name: "description", content: "Track tenant resource consumption and limits." },
    ],
  }),
});

const usageData = [
  { tenant: "Atlas Financial", apiCalls: "45.2k", storage: "1.2GB", users: "24" },
  { tenant: "Nairobi Health", apiCalls: "12.8k", storage: "842MB", users: "12" },
  { tenant: "Greenfields Co.", apiCalls: "8.4k", storage: "423MB", users: "8" },
  { tenant: "Skyline Academy", apiCalls: "2.1k", storage: "156MB", users: "45" },
  { tenant: "Urban Retail", apiCalls: "18.6k", storage: "764MB", users: "16" },
];

function AdminUsageMonitoringPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Usage Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track tenant resource consumption and limits.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total API calls" value="12.4M" delta="Today" icon={BarChart3} />
        <StatCard
          label="Avg. usage"
          value="84%"
          delta="Within limits"
          icon={TrendingUp}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Top tenant"
          value="Atlas"
          delta="45.2k calls"
          icon={Users}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Storage used"
          value="124GB"
          delta="+2.1GB today"
          icon={BarChart3}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Tenant usage</h2>
          <Link
            to="/admin/usage-monitoring"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Tenant</th>
                <th className="py-2 font-medium">API calls</th>
                <th className="py-2 font-medium">Storage</th>
                <th className="py-2 font-medium">Active users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {usageData.map((u) => (
                <tr key={u.tenant} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{u.tenant}</td>
                  <td className="py-3 text-muted-foreground">{u.apiCalls}</td>
                  <td className="py-3 text-muted-foreground">{u.storage}</td>
                  <td className="py-3 text-muted-foreground">{u.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}