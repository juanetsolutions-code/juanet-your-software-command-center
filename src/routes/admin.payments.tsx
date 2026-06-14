import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listPayments } from "@/lib/dashboard/repositories/payments";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: listPayments,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">All processed and pending payments.</p>
        </div>
        <CreditCard className="h-6 w-6 text-brand-cyan" />
      </header>
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : payments.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No payments recorded yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4">Payment</th>
                <th className="text-left p-4">Invoice</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="p-4 font-medium">{p.id.slice(0, 8)}</td>
                  <td className="p-4">{p.invoiceId?.slice(0, 8) ?? "—"}</td>
                  <td className="p-4">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.amount)}
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5">{p.status}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
