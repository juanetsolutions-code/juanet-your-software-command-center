import { createFileRoute } from "@tanstack/react-router";
import { Store, ShoppingCart, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/shop")({
  component: AdminShopPage,
  head: () => ({
    meta: [
      { title: "Product Shop | Admin Console" },
      { name: "description", content: "Manage available products and pricing." },
    ],
  }),
});

const products = [
  {
    id: "prod-001",
    name: "Enterprise Suite",
    price: "$2,500/mo",
    sold: "45 tenants",
    status: "active",
  },
  {
    id: "prod-002",
    name: "Pro Subscription",
    price: "$499/mo",
    sold: "321 tenants",
    status: "active",
  },
  {
    id: "prod-003",
    name: "Standard Plan",
    price: "$199/mo",
    sold: "189 tenants",
    status: "active",
  },
];

function AdminShopPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Product Shop</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage available products and pricing.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value="3" delta="All active" icon={Store} />
        <StatCard
          label="Total sales"
          value="555 tenants"
          delta="Across all products"
          icon={ShoppingCart}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Monthly revenue"
          value="$182k"
          delta="From product sales"
          icon={ShoppingCart}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Top seller"
          value="Pro Plan"
          delta="321 tenants"
          icon={Store}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Products</h2>
          <Link
            to="/admin/shop"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {products.length === 0 ? (
          <EmptyState
            icon={<Store className="h-10 w-10" />}
            title="No products yet"
            description="Add products to start selling."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">Price</th>
                  <th className="py-2 font-medium">Sold</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.price}</td>
                    <td className="py-3 text-muted-foreground">{p.sold}</td>
                    <td className="py-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan">
                        {p.status}
                      </span>
                    </td>
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