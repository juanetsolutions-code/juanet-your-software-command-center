import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, listOrders, updateOrderStatus, formatMoney } from "@/lib/admin-ops";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

const STATUSES = ["pending", "paid", "fulfilled", "refunded", "cancelled"] as const;

function OrdersPage() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: listOrders });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerEmail: "", total: "" });

  const createMut = useMutation({
    mutationFn: () =>
      createOrder({
        customerName: form.customerName,
        customerEmail: form.customerEmail || undefined,
        totalCents: Math.round(Number(form.total || "0") * 100),
      }),
    onSuccess: () => {
      toast.success("Order created");
      setOpen(false);
      setForm({ customerName: "", customerEmail: "", total: "" });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to create order"),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all customer orders and fulfillment.</p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-brand-cyan" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New order
          </button>
        </div>
      </header>

      {open && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold">Create order</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
              placeholder="Customer name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
            <input
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
              placeholder="Customer email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            />
            <input
              type="number"
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
              placeholder="Total (USD)"
              value={form.total}
              onChange={(e) => setForm({ ...form, total: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button
              disabled={!form.customerName || createMut.isPending}
              onClick={() => createMut.mutate()}
              className="h-9 px-4 rounded-lg text-sm font-medium bg-brand-cyan/20 text-brand-cyan disabled:opacity-50"
            >
              {createMut.isPending ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setOpen(false)} className="h-9 px-4 rounded-lg text-sm border border-white/10">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No orders yet. Create one to get started.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/5">
                  <td className="p-4 font-medium">{o.orderNumber ?? o.id.slice(0, 8)}</td>
                  <td className="p-4">{o.customerName}</td>
                  <td className="p-4">{formatMoney(o.totalCents, o.currency)}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => statusMut.mutate({ id: o.id, status: e.target.value })}
                      className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString()}
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
