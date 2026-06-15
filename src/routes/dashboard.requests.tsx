import { createFileRoute } from "@tanstack/react-router";
import { FileText, Inbox } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StatusBadge } from "@/components/app/StatusBadge";
import { RequestForm } from "@/components/dashboard/RequestForm";
import { listBudgetRanges, listTimelineOptions } from "@/lib/dashboard";
import { listMyRequests, createRequest } from "@/lib/client-dashboard";

export const Route = createFileRoute("/dashboard/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const qc = useQueryClient();
  const budgetRanges = listBudgetRanges();
  const timelineOptions = listTimelineOptions();

  const { data: recent = [] } = useQuery({
    queryKey: ["my-requests"],
    queryFn: listMyRequests,
  });

  function handleSubmit(draft: {
    title: string;
    description: string;
    serviceSlug: string;
    budgetRange: string;
    timeline: string;
    deadlineAt: string | null;
  }) {
    // Fire-and-forget; surface result via toast & refetch.
    void createRequest({
      subject: draft.title,
      description: draft.description,
      serviceSlug: draft.serviceSlug,
      budgetRange: draft.budgetRange,
      timeline: draft.timeline,
      deadlineAt: draft.deadlineAt,
    })
      .then((res) => {
        if (res) toast.success("Request submitted");
        qc.invalidateQueries({ queryKey: ["my-requests"] });
      })
      .catch((e: Error) => toast.error(e.message));
    return { id: "pending" };
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Request a service</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us what you're building. We'll scope it within 24 hours.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RequestForm
            budgetRanges={budgetRanges}
            timelineOptions={timelineOptions}
            onSubmit={handleSubmit}
          />
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Inbox className="h-4 w-4 text-brand-cyan" /> Your recent requests
            </div>
            {recent.length === 0 ? (
              <div className="mt-4 text-xs text-muted-foreground">No requests yet.</div>
            ) : (
              <ul className="mt-4 space-y-3">
                {recent.slice(0, 8).map((r) => (
                  <li key={r.id} className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        {r.id.slice(0, 8)}
                      </span>
                      <StatusBadge status={r.status as any} />
                    </div>
                    <div className="mt-1 text-sm">{r.subject}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Submitted {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
