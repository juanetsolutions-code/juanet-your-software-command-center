import { createFileRoute } from "@tanstack/react-router";
import { Activity, Download, ExternalLink } from "lucide-react";
import { NoActivityState } from "@/components/states/NoActivityState";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/activity")({
  component: ActivityPage,
});

const mockActivity = [
  { id: "a-1", kind: "deploy", text: "atlas-core deployed to staging", time: "12m ago" },
  { id: "a-2", kind: "message", text: "Marcus replied on Skyline LMS", time: "1h ago" },
  { id: "a-3", kind: "invoice", text: "INV-1042 paid via M-Pesa", time: "3h ago" },
  { id: "a-4", kind: "license", text: "Pulse CRM key issued", time: "Yesterday" },
  { id: "a-5", kind: "request", text: "New request: Internal HR portal", time: "2d ago" },
  { id: "a-6", kind: "project", text: "Harvest ERP status updated to planning", time: "3d ago" },
];

function ActivityPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Activity History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A chronological history of all platform activity.
        </p>
      </header>

      <div className="glass rounded-2xl p-5">
        {mockActivity.length === 0 ? (
          <NoActivityState />
        ) : (
          <ul className="space-y-4">
            {mockActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-cyan" />
                <div className="text-sm flex-1">
                  <div>{a.text}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {a.kind} • {a.time}
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
