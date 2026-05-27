import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, TrendingUp, Calendar, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/services")({
  component: AdminServicesPage,
});

const subscriptions = [
  {
    id: "s-01",
    tenant: "Atlas Financial",
    plan: "Enterprise",
    price: "$2,500",
    status: "Active",
    renewal: "Jun 12, 2026",
  },
  {
    id: "s-02",
    tenant: "Nairobi Health",
    plan: "Pro",
    price: "$499",
    status: "Active",
    renewal: "Jul 22, 2026",
  },
  {
    id: "s-03",
    tenant: "Greenfields Co.",
    plan: "Pro",
    price: "$499",
    status: "Trial ends",
    renewal: "May 30, 2026",
  },
  {
    id: "s-04",
    tenant: "Skyline Academy",
    plan: "Standard",
    price: "$199",
    status: "Active",
    renewal: "Aug 15, 2026",
  },
  {
    id: "s-05",
    tenant: "Urban Retail",
    plan: "Pro",
    price: "$499",
    status: "Active",
    renewal: "Sep 08, 2026",
  },
];

function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer subscriptions and billing.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="MRR" value="$48,210" delta="+8.2% MoM" icon={CreditCard} />
        <StatCard
          label="Active subs"
          value="842"
          delta="91% renewal rate"
          icon={Calendar}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Trials"
          value="34"
          delta="8 converting"
          icon={Calendar}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="ARR"
          value="$578k"
          delta="Annual run rate"
          icon={TrendingUp}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent subscriptions</h2>
          <Link
            to="/admin/services"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Customer</th>
                <th className="py-2 font-medium">Plan</th>
                <th className="py-2 font-medium">Price</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{s.tenant}</td>
                  <td className="py-3 text-muted-foreground">{s.plan}</td>
                  <td className="py-3 text-muted-foreground">{s.price}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        s.status === "Active"
                          ? "bg-brand-cyan/15 text-brand-cyan"
                          : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{s.renewal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
