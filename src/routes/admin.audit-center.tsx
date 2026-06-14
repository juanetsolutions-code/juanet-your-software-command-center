import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listAuditEvents } from "@/lib/admin-ops";

export const Route = createFileRoute("/admin/audit-center")({
  component: AuditCenterPage,
});

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function AuditCenterPage() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: () => listAuditEvents(200),
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Audit Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Immutable log of every privileged action.</p>
        </div>
        <ShieldCheck className="h-6 w-6 text-brand-cyan" />
      </header>
      <div className="glass rounded-2xl p-5">
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-6">Loading…</div>
        ) : events.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6">No audit events recorded yet.</div>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-cyan" />
                <div className="flex-1">
                  <div>
                    <code className="text-brand-cyan">{e.action}</code>
                    {e.resourceType && (
                      <> on <span className="font-medium">{e.resourceType}</span></>
                    )}
                    {e.resourceId && (
                      <> <span className="text-muted-foreground">#{e.resourceId.slice(0, 8)}</span></>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {e.id.slice(0, 8)} • {timeAgo(e.createdAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
