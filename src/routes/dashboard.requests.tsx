import { createFileRoute } from "@tanstack/react-router";
import { FileText, Inbox } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";
import { RequestForm } from "@/components/dashboard/RequestForm";
import {
  createServiceRequest,
  listBudgetRanges,
  listRequests,
  listTimelineOptions,
} from "@/lib/dashboard";

export const Route = createFileRoute("/dashboard/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const recent = listRequests();
  const budgetRanges = listBudgetRanges();
  const timelineOptions = listTimelineOptions();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Request a service
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us what you're building. We'll scope it within 24 hours.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RequestForm
            budgetRanges={budgetRanges}
            timelineOptions={timelineOptions}
            onSubmit={createServiceRequest}
          />
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Inbox className="h-4 w-4 text-brand-cyan" /> Your recent requests
            </div>
            <ul className="mt-4 space-y-3">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-white/5 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-1 text-sm">{r.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Submitted {r.submittedLabel}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-brand-cyan" /> What happens next
            </div>
            <ol className="mt-4 space-y-3 text-xs text-muted-foreground">
              {[
                "Architect review & scoping call",
                "Detailed proposal with milestones",
                "Contract + kickoff in your workspace",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="h-5 w-5 shrink-0 grid place-items-center rounded-full bg-brand-blue/15 text-brand-cyan text-[10px] font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
