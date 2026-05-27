import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Activity, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

const tenants = [
  {
    id: "t-01",
    name: "Atlas Financial",
    plan: "Enterprise",
    projects: 3,
    status: "Active",
    createdAt: "Jan 2024",
  },
  {
    id: "t-02",
    name: "Nairobi Health",
    plan: "Pro",
    projects: 1,
    status: "Active",
    createdAt: "Feb 2024",
  },
  {
    id: "t-03",
    name: "Greenfields Co.",
    plan: "Pro",
    projects: 1,
    status: "Trial",
    createdAt: "Mar 2024",
  },
  {
    id: "t-04",
    name: "Skyline Academy",
    plan: "Standard",
    projects: 2,
    status: "Active",
    createdAt: "Jan 2025",
  },
  {
    id: "t-05",
    name: "Urban Retail",
    plan: "Pro",
    projects: 2,
    status: "Active",
    createdAt: "Feb 2025",
  },
  {
    id: "t-06",
    name: "Logix Logistics",
    plan: "Pro",
    projects: 1,
    status: "Active",
    createdAt: "Mar 2025",
  },
];

function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Tenant Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All customers and their subscription status.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total tenants" value="1,284" delta="+42 this week" icon={Building2} />
        <StatCard
          label="Active tenants"
          value="1,052"
          delta="82% active rate"
          icon={Activity}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Enterprise"
          value="45"
          delta="3.5% of total"
          icon={CreditCard}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="MRR"
          value="$48,210"
          delta="+8.2% MoM"
          icon={CreditCard}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent tenants</h2>
          <Link
            to="/admin/users"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Plan</th>
                <th className="py-2 font-medium">Projects</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{t.name}</td>
                  <td className="py-3 text-muted-foreground">{t.plan}</td>
                  <td className="py-3 text-muted-foreground">{t.projects}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        t.status === "Active"
                          ? "bg-brand-cyan/15 text-brand-cyan"
                          : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{t.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
