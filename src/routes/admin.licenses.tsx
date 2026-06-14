import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issueLicense, listLicenses, revokeLicense } from "@/lib/admin-ops";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/licenses")({
  component: AdminLicensesPage,
});

function AdminLicensesPage() {
  const qc = useQueryClient();
  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ["admin-licenses"],
    queryFn: listLicenses,
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productName: "", customerName: "", customerEmail: "", seats: 1 });

  const issueMut = useMutation({
    mutationFn: () =>
      issueLicense({
        productName: form.productName,
        customerName: form.customerName,
        customerEmail: form.customerEmail || undefined,
        seats: Number(form.seats) || 1,
      }),
    onSuccess: () => {
      toast.success("License issued");
      setOpen(false);
      setForm({ productName: "", customerName: "", customerEmail: "", seats: 1 });
      qc.invalidateQueries({ queryKey: ["admin-licenses"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const revokeMut = useMutation({
    mutationFn: revokeLicense,
    onSuccess: () => {
      toast.success("License revoked");
      qc.invalidateQueries({ queryKey: ["admin-licenses"] });
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">License Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Issue, revoke and audit product licenses.</p>
        </div>
        <div className="flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-brand-cyan" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Issue license
          </button>
        </div>
      </header>

      {open && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold">Issue new license</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Product"
              value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Customer"
              value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Email"
              value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            <input type="number" min={1} className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Seats"
              value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} />
          </div>
          <div className="flex gap-2">
            <button
              disabled={!form.productName || !form.customerName || issueMut.isPending}
              onClick={() => issueMut.mutate()}
              className="h-9 px-4 rounded-lg text-sm font-medium bg-brand-cyan/20 text-brand-cyan disabled:opacity-50"
            >
              {issueMut.isPending ? "Issuing…" : "Issue"}
            </button>
            <button onClick={() => setOpen(false)} className="h-9 px-4 rounded-lg text-sm border border-white/10">Cancel</button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : licenses.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No licenses issued yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4">Key</th>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Seats</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((l) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="p-4 font-mono text-xs">{l.licenseKey}</td>
                  <td className="p-4">{l.productName}</td>
                  <td className="p-4">{l.customerName}</td>
                  <td className="p-4">{l.seatsUsed}/{l.seats}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${l.status === "active" ? "bg-brand-cyan/15 text-brand-cyan" : "bg-white/10 text-muted-foreground"}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {l.status === "active" && (
                      <button
                        onClick={() => revokeMut.mutate(l.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Revoke
                      </button>
                    )}
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
