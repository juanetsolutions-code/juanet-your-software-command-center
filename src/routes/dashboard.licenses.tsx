import { createFileRoute } from "@tanstack/react-router"
import { KeyRound, Check, Clock, Copy, RefreshCw, ArrowUpRight, Plus } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/licenses")({
  component: LicensesPage,
  head: () => ({
    meta: [
      { title: "Licenses | Juanet Dashboard" },
      { name: "description", content: "Manage your product licenses and keys." },
    ],
  }),
});

const licenses = [
  {
    id: "lic-001",
    product: "Pulse CRM",
    key: "PK-8B4N-2X9M-QW3R",
    status: "active",
    expires: "Mar 2027",
    usage: "12/50 instances",
  },
  {
    id: "lic-002",
    product: "Nexus Analytics",
    key: "NX-1F7K-9L2P-RT5Y",
    status: "active",
    expires: "Jan 2027",
    usage: "8/25 instances",
  },
  {
    id: "lic-003",
    product: "Streamline UI",
    key: "SL-4Z2W-8V6N-HJ9K",
    status: "expired",
    expires: "Expired",
    usage: "0/10 instances",
  },
];

function LicensesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Licenses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product licenses and keys.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
            <Plus className="h-4 w-4" /> New license
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total licenses" value="3" delta="1 expired" icon={KeyRound} />
        <StatCard
          label="Active licenses"
          value="2"
          delta="Ready to use"
          icon={Check}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="License volume"
          value="75"
          delta="Total instances"
          icon={KeyRound}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Expiring soon"
          value="0"
          delta="All valid"
          icon={Clock}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Your licenses</h2>
          <Link
            to="/dashboard/licenses"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Product</th>
                <th className="py-2 font-medium">License key</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Expires</th>
                <th className="py-2 font-medium">Usage</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {licenses.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{l.product}</td>
                  <td className="py-3 font-mono text-xs">{l.key}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        l.status === "active"
                          ? "bg-brand-cyan/15 text-brand-cyan"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{l.expires}</td>
                  <td className="py-3 text-muted-foreground">{l.usage}</td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-muted-foreground hover:text-brand-cyan inline-flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}