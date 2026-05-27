import { createFileRoute } from "@tanstack/react-router";
import { Plug, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/integrations")({
  component: AdminIntegrationsPage,
});

const integrations = [
  { id: "int-1", name: "Stripe", status: "connected", accounts: 42, lastSync: "5m ago" },
  { id: "int-2", name: "M-Pesa", status: "connected", accounts: 28, lastSync: "12m ago" },
  { id: "int-3", name: "GitHub", status: "connected", accounts: 128, lastSync: "1h ago" },
  { id: "int-4", name: "Slack", status: "disconnected", accounts: 0, lastSync: "—" },
  { id: "int-5", name: "Notion", status: "connected", accounts: 64, lastSync: "2h ago" },
  { id: "int-6", name: "Google Workspace", status: "error", accounts: 3, lastSync: "Failed" },
];

function AdminIntegrationsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connected services and their sync status.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Active integrations</h2>
          <span className="text-xs text-muted-foreground">4 of 6 connected</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((i) => (
            <div
              key={i.id}
              className="rounded-lg glass p-4 hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{i.name}</span>
                <div className="flex items-center gap-1.5">
                  {i.status === "connected" ? (
                    <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                  ) : i.status === "error" ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  )}
                  <span
                    className={`text-[10px] uppercase tracking-wider ${
                      i.status === "connected"
                        ? "text-brand-cyan"
                        : i.status === "error"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {i.status}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Accounts: {i.accounts}</div>
                <div>Last sync: {i.lastSync}</div>
              </div>
              <Link
                to="/admin/integrations"
                className="mt-3 inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
              >
                Manage <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
