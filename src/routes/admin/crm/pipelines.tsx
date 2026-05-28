import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Search } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { getCurrentOrganization } from "@/lib/tenant/context";

export const Route = createFileRoute("/admin/crm/pipelines")({
  component: AdminPipelinesPage,
  head: () => ({
    meta: [
      { title: "Pipelines | Admin Console" },
      { name: "description", content: "Manage sales pipelines and stages." },
    ],
  }),
});

function AdminPipelinesPage() {
  const org = getCurrentOrganization();
  const pipelines: Array<{ id: string; name: string; description: string; stages: Array<{ name: string; probability: number }> }> = [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Pipelines</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure sales pipelines and stages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search pipelines..."
              className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50"
            />
          </div>
        </div>
      </header>

      {pipelines.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="h-10 w-10" />}
          title="No pipelines yet"
          description="Create pipelines to organize your sales process."
        />
      ) : (
        <div className="grid gap-4">
          {pipelines.map((pipeline) => (
            <div key={pipeline.id} className="glass rounded-2xl p-5">
              <h3 className="font-semibold mb-2">{pipeline.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{pipeline.description}</p>
              <div className="flex flex-wrap gap-2">
                {pipeline.stages.map((stage) => (
                  <span key={stage.name} className="text-xs px-2 py-1 rounded-full bg-white/5">
                    {stage.name} ({stage.probability}%)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}