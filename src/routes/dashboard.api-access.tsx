import { createFileRoute } from "@tanstack/react-router"
import { KeyRound, Globe, Shield, RefreshCw, ArrowUpRight, Plus, Copy } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/api-access")({
  component: ApiAccessPage,
  head: () => ({
    meta: [
      { title: "API Access | Juanet Dashboard" },
      { name: "description", content: "Manage API keys and integration access." },
    ],
  }),
});

const apiKeys = [
  {
    id: "key-1",
    name: "Production key",
    key: "sk_live_8b4n2x9m...",
    created: "Jan 15, 2025",
    lastUsed: "2m ago",
    status: "active",
  },
  {
    id: "key-2",
    name: "Staging key",
    key: "sk_test_1f7k9l2p...",
    created: "Feb 22, 2025",
    lastUsed: "1h ago",
    status: "active",
  },
  {
    id: "key-3",
    name: "Legacy key",
    key: "sk_legacy_4z2w8v6n...",
    created: "Aug 10, 2024",
    lastUsed: "2 weeks ago",
    status: "revoked",
  },
];

function ApiAccessPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">API Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage API keys and integration access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
            <Plus className="h-4 w-4" /> New key
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="API keys" value="3" delta="2 active" icon={KeyRound} />
        <StatCard
          label="Requests today"
          value="12.8k"
          delta="Within limits"
          icon={Globe}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Rate limit"
          value="1,000/min"
          delta="Current tier"
          icon={Shield}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Last request"
          value="2m ago"
          delta="Production key"
          icon={Globe}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Your API keys</h2>
          <Link
            to="/dashboard/api-access"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Key</th>
                <th className="py-2 font-medium">Created</th>
                <th className="py-2 font-medium">Last used</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{k.name}</td>
                  <td className="py-3 font-mono text-xs">{k.key}</td>
                  <td className="py-3 text-muted-foreground">{k.created}</td>
                  <td className="py-3 text-muted-foreground">{k.lastUsed}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        k.status === "active"
                          ? "bg-brand-cyan/15 text-brand-cyan"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
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