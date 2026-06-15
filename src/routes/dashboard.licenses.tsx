import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listMyLicenses } from "@/lib/client-dashboard";

export const Route = createFileRoute("/dashboard/licenses")({
  component: DashboardLicensesPage,
});

function DashboardLicensesPage() {
  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ["my-licenses"],
    queryFn: listMyLicenses,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">My Licenses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your active product licenses.
          </p>
        </div>
        <KeyRound className="h-6 w-6 text-brand-cyan" />
      </header>

      {isLoading ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : licenses.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground">No licenses issued yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenses.map((l) => (
            <div key={l.id} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{l.licenseKey}</div>
                  <div className="text-lg font-semibold mt-1">{l.productName}</div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    l.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {l.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span>
                    {l.seatsUsed} / {l.seats}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span>{l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : "Never"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
