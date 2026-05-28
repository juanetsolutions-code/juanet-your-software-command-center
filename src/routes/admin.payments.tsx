import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
  head: () => ({
    meta: [
      { title: "Payments | Admin Console" },
      { name: "description", content: "All payment transactions and payouts." },
    ],
  }),
});

const payments = [
  {
    id: "pay-001",
    tenant: "Atlas Financial",
    amount: "$2,500",
    status: "paid",
    method: "Bank Transfer",
    date: "May 15, 2026",
  },
  {
    id: "pay-002",
    tenant: "Urban Retail",
    amount: "$499",
    status: "paid",
    method: "M-Pesa",
    date: "May 14, 2026",
  },
  {
    id: "pay-003",
    tenant: "Greenfields Co.",
    amount: "$499",
    status: "failed",
    method: "Card",
    date: "May 13, 2026",
  },
];

function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All payment transactions and payouts.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total volume" value="$1.2M" delta="This quarter" icon={CreditCard} />
        <StatCard
          label="Success rate"
          value="98.2%"
          delta="Within SLA"
          icon={CreditCard}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Failed today"
          value="2"
          delta="Needs attention"
          icon={CreditCard}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Payouts"
          value="$84k"
          delta="To partners"
          icon={CreditCard}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent payments</h2>
          <Link
            to="/admin/payments"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {payments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-10 w-10" />}
            title="No payments yet"
            description="Payment transactions will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Tenant</th>
                  <th className="py-2 font-medium">Amount</th>
                  <th className="py-2 font-medium">Method</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{p.tenant}</td>
                    <td className="py-3 text-muted-foreground">{p.amount}</td>
                    <td className="py-3 text-muted-foreground">{p.method}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                          p.status === "paid"
                            ? "bg-brand-cyan/15 text-brand-cyan"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.date}</td>
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