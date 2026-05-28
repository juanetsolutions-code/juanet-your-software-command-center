import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
  head: () => ({
    meta: [
      { title: "Orders | Admin Console" },
      { name: "description", content: "View all customer purchases and transactions." },
    ],
  }),
});

const orders = [
  {
    id: "ord-001",
    product: "Enterprise License",
    tenant: "Atlas Financial",
    amount: "$2,500",
    status: "completed",
    date: "May 15, 2026",
  },
  {
    id: "ord-002",
    product: "Pro Subscription",
    tenant: "Urban Retail",
    amount: "$499",
    status: "completed",
    date: "May 14, 2026",
  },
  {
    id: "ord-003",
    product: "Standard Plan",
    tenant: "Skyline Academy",
    amount: "$199",
    status: "refunded",
    date: "May 10, 2026",
  },
];

function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All customer purchases and transactions.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Orders today" value="38" delta="+12 from yesterday" icon={ShoppingBag} />
        <StatCard
          label="Revenue"
          value="$12.4k"
          delta="This week"
          icon={ShoppingBag}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Refunds"
          value="2"
          delta="This month"
          icon={ShoppingBag}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Avg. order"
          value="$542"
          delta="Across all plans"
          icon={ShoppingBag}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent orders</h2>
          <Link
            to="/admin/orders"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Order ID</th>
                <th className="py-2 font-medium">Product</th>
                <th className="py-2 font-medium">Tenant</th>
                <th className="py-2 font-medium">Amount</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-mono text-xs">{o.id}</td>
                  <td className="py-3 font-medium">{o.product}</td>
                  <td className="py-3 text-muted-foreground">{o.tenant}</td>
                  <td className="py-3 text-muted-foreground">{o.amount}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        o.status === "completed"
                          ? "bg-brand-cyan/15 text-brand-cyan"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}