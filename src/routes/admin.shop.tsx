import { createFileRoute } from "@tanstack/react-router";
import { Store, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, listProducts, formatMoney } from "@/lib/admin-ops";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/shop")({
  component: AdminShopPage,
});

function AdminShopPage() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: listProducts,
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", price: "" });

  const createMut = useMutation({
    mutationFn: () =>
      createProduct({
        name: form.name,
        sku: form.sku || undefined,
        priceCents: Math.round(Number(form.price || "0") * 100),
      }),
    onSuccess: () => {
      toast.success("Product added");
      setOpen(false);
      setForm({ name: "", sku: "", price: "" });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product removed");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Shop Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage products available in the marketplace.</p>
        </div>
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-brand-cyan" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>
      </header>

      {open && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold">Add product</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="SKU (optional)"
              value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input type="number" className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Price (USD)"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button
              disabled={!form.name || createMut.isPending}
              onClick={() => createMut.mutate()}
              className="h-9 px-4 rounded-lg text-sm font-medium bg-brand-cyan/20 text-brand-cyan disabled:opacity-50"
            >
              {createMut.isPending ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setOpen(false)} className="h-9 px-4 rounded-lg text-sm border border-white/10">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="p-6 text-sm text-muted-foreground">Loading…</div>
      ) : products.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">No products yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-5 relative group">
              <div className="text-xs text-muted-foreground">{p.sku ?? p.id.slice(0, 8)}</div>
              <div className="text-lg font-semibold mt-1">{p.name}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-brand-cyan font-medium">{formatMoney(p.priceCents, p.currency)}</span>
                <button
                  onClick={() => deleteMut.mutate(p.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 transition"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
