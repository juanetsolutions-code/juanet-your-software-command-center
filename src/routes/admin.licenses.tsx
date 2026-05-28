import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/licenses")({
  component: AdminLicensesPage,
  head: () => ({
    meta: [
      { title: "Licenses | Admin Console" },
      { name: "description", content: "All issued license keys for tenant products." },
    ],
  }),
});

const licenses = [
  {
    id: "lic-001",
    product: "Pulse CRM",
    tenant: "Urban Retail",
    key: "PK-8B4N-2X9M-QW3R",
    expires: "Mar 2027",
    status: "active",
  },
  {
    id: "lic-002",
    product: "Nexus Analytics",
    tenant: "Nairobi Health",
    key: "NX-1F7K-9L2P-RT5Y",
    expires: "Jan 2027",
    status: "active",
  },
];

function AdminLicensesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Licenses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All issued license keys for tenant products.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total licenses" value="1,124" delta="Active keys" icon={KeyRound} />
        <StatCard
          label="Expiring soon"
          value="23"
          delta="Within 30 days"
          icon={KeyRound}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Products"
          value="8"
          delta="Available for licensing"
          icon={KeyRound}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Revoked"
          value="12"
          delta="This quarter"
          icon={KeyRound}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">All licenses</h2>
          <Link
            to="/admin/licenses"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {licenses.length === 0 ? (
          <EmptyState
            icon={<KeyRound className="h-10 w-10" />}
            title="No licenses yet"
            description="Licenses will appear here as they are issued."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">Tenant</th>
                  <th className="py-2 font-medium">Key</th>
                  <th className="py-2 font-medium">Expires</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {licenses.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{l.product}</td>
                    <td className="py-3 text-muted-foreground">{l.tenant}</td>
                    <td className="py-3 font-mono text-xs">{l.key}</td>
                    <td className="py-3 text-muted-foreground">{l.expires}</td>
                    <td className="py-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan">
                        {l.status}
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