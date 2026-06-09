import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Plus, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useState, type FormEvent } from "react";
import { pipelineService } from "@/lib/crm/services/pipeline-service";
import { useOrganizationId } from "@/lib/tenant/useOrganization";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/crm/pipelines")({
  component: AdminPipelinesPage,
  head: () => ({
    meta: [
      { title: "Pipelines | Admin Console" },
      { name: "description", content: "Manage sales pipelines and stages." },
    ],
  }),
});

const DEFAULT_STAGES = [
  { name: "Prospecting", probability: 10 },
  { name: "Qualification", probability: 25 },
  { name: "Proposal", probability: 50 },
  { name: "Negotiation", probability: 75 },
  { name: "Closed Won", probability: 100 },
];

function PipelineForm({ orgId, open, onOpenChange }: { orgId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => pipelineService.create(orgId, { name, description, stages: DEFAULT_STAGES }),
    onSuccess: () => {
      toast.success("Pipeline created");
      qc.invalidateQueries({ queryKey: ["pipelines"] });
      onOpenChange(false);
      setName(""); setDescription("");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name) return;
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
          <Plus className="h-4 w-4" /> New pipeline
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Pipeline</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" rows={3} />
          </div>
          <p className="text-xs text-muted-foreground">
            Default stages will be added: {DEFAULT_STAGES.map((s) => s.name).join(", ")}.
          </p>
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50">
              {mutation.isPending ? "Creating..." : "Create Pipeline"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminPipelinesPage() {
  const { data: orgId, isLoading: orgLoading } = useOrganizationId();
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: pipelines = [], isLoading } = useQuery({
    queryKey: ["pipelines", orgId],
    queryFn: () => pipelineService.list(orgId!),
    enabled: !!orgId,
  });

  const remove = useMutation({
    mutationFn: (id: string) => pipelineService.remove(id, orgId!),
    onSuccess: () => {
      toast.success("Pipeline deleted");
      qc.invalidateQueries({ queryKey: ["pipelines"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Cannot delete (deals may be using it)"),
  });

  if (orgLoading || isLoading) {
    return <div className="flex items-center justify-center p-8"><span className="text-muted-foreground">Loading pipelines...</span></div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Pipelines</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure sales pipelines and stages.</p>
        </div>
        {orgId && <PipelineForm orgId={orgId} open={open} onOpenChange={setOpen} />}
      </header>

      {pipelines.length === 0 ? (
        <EmptyState icon={<BarChart3 className="h-10 w-10" />} title="No pipelines yet" description="Create pipelines to organize your sales process." />
      ) : (
        <div className="grid gap-4">
          {pipelines.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.description || "—"}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="h-4 w-4" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => remove.mutate(p.id)} className="text-red-400">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.stages.map((s) => (
                  <span key={s.id} className="text-xs px-2 py-1 rounded-full bg-white/5">
                    {s.name} ({s.probability}%)
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
