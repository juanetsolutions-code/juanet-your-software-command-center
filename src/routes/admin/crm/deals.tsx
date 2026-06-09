import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Search, Plus, Calendar } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useState, type FormEvent } from "react";
import { dealService } from "@/lib/crm/services/deal-service";
import { useOrganizationId } from "@/lib/tenant/useOrganization";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { Deal } from "@/lib/crm/core/crm-entities";
import type { DealStage } from "@/lib/crm/core/crm-types";

export const Route = createFileRoute("/admin/crm/deals")({
  component: AdminDealsPage,
  head: () => ({
    meta: [
      { title: "Deals | Admin Console" },
      { name: "description", content: "Manage sales deals and opportunities with pipeline view." },
    ],
  }),
});

const STAGES: DealStage[] = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
const VISIBLE_STAGES: DealStage[] = ["prospecting", "qualification", "proposal", "negotiation"];

function StageBadge({ stage, probability }: { stage: DealStage; probability: number }) {
  const colors: Record<string, string> = {
    prospecting: "bg-blue-500/15 text-blue-400",
    qualification: "bg-amber-500/15 text-amber-400",
    proposal: "bg-purple-500/15 text-purple-400",
    negotiation: "bg-green-500/15 text-green-400",
    closed_won: "bg-emerald-500/15 text-emerald-400",
    closed_lost: "bg-gray-500/15 text-gray-400",
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${colors[stage]}`}>
      {stage.replace("_", " ")} ({probability}%)
    </span>
  );
}

function DealCard({ deal, orgId }: { deal: Deal; orgId: string }) {
  const qc = useQueryClient();
  const move = useMutation({
    mutationFn: (stage: DealStage) => dealService.moveStage(deal.id, stage, orgId),
    onSuccess: () => {
      toast.success("Stage updated");
      qc.invalidateQueries({ queryKey: ["deals"] });
    },
  });

  return (
    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">{deal.name}</h4>
        <span className="text-xs font-semibold">${deal.value.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <StageBadge stage={deal.stage} probability={deal.probability} />
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "—"}
        </span>
      </div>
      <select
        value={deal.stage}
        onChange={(e) => move.mutate(e.target.value as DealStage)}
        disabled={move.isPending}
        className="w-full h-7 px-2 rounded text-xs bg-white/5 border border-white/10 capitalize"
      >
        {STAGES.map((s) => <option key={s} value={s}>Move to: {s.replace("_", " ")}</option>)}
      </select>
    </div>
  );
}

function DealForm({ orgId, open, onOpenChange }: { orgId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState<DealStage>("prospecting");
  const [probability, setProbability] = useState("50");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      dealService.create({ name, value: Number(value), stage, probability: Number(probability) }, orgId),
    onSuccess: () => {
      toast.success("Deal created");
      qc.invalidateQueries({ queryKey: ["deals"] });
      onOpenChange(false);
      setName(""); setValue(""); setStage("prospecting"); setProbability("50");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to create deal"),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !value) return;
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
          <Plus className="h-4 w-4" /> New deal
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create New Deal</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Deal Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Enterprise License" className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Value ($)</label>
            <input required type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="100000" className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value as DealStage)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1 capitalize">
              {STAGES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Probability (%)</label>
            <input type="number" min="0" max="100" value={probability} onChange={(e) => setProbability(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50">
              {mutation.isPending ? "Creating..." : "Create Deal"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminDealsPage() {
  const { data: orgId, isLoading: orgLoading } = useOrganizationId();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals", orgId],
    queryFn: () => dealService.list(orgId!),
    enabled: !!orgId,
  });

  if (orgLoading || isLoading) {
    return <div className="flex items-center justify-center p-8"><span className="text-muted-foreground">Loading deals...</span></div>;
  }

  const forecast = deals
    .filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost")
    .reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Deals</h1>
          <p className="text-sm text-muted-foreground mt-1">Pipeline forecast: ${forecast.toLocaleString()} weighted value</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Search deals..." className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50 w-48" />
          </div>
          {orgId && <DealForm orgId={orgId} open={showAddDialog} onOpenChange={setShowAddDialog} />}
        </div>
      </header>

      {deals.length === 0 ? (
        <EmptyState icon={<TrendingUp className="h-10 w-10" />} title="No deals yet" description="Create deals to start tracking your sales pipeline." />
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {VISIBLE_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            return (
              <div key={stage} className="glass rounded-2xl p-4">
                <h3 className="font-semibold text-sm mb-3 capitalize">{stage} <span className="text-muted-foreground">({stageDeals.length})</span></h3>
                <div className="space-y-2">
                  {stageDeals.length > 0
                    ? stageDeals.map((d) => orgId && <DealCard key={d.id} deal={d} orgId={orgId} />)
                    : <p className="text-xs text-muted-foreground">No deals in {stage}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
