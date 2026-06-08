import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Search,
  Plus,
  MoreHorizontal,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useState, type FormEvent } from "react";
import { dealService } from "@/lib/crm/services/deal-service";
import { getCurrentOrganization } from "@/lib/tenant/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/crm/deals")({
  component: AdminDealsPage,
  head: () => ({
    meta: [
      { title: "Deals | Admin Console" },
      { name: "description", content: "Manage sales deals and opportunities with pipeline view." },
    ],
  }),
});

type DealItem = {
  id: string;
  name: string;
  value: number;
  stage:
    | "prospecting"
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  probability: number;
  expectedCloseDate?: string;
  assignedTo?: string;
  pipelineId: string;
  createdAt?: string;
};

function StageBadge({ stage, probability }: { stage: DealItem["stage"]; probability: number }) {
  const colors: Record<string, string> = {
    prospecting: "bg-blue-500/15 text-blue-400",
    qualification: "bg-amber-500/15 text-amber-400",
    proposal: "bg-purple-500/15 text-purple-400",
    negotiation: "bg-green-500/15 text-green-400",
    closed_won: "bg-emerald-500/15 text-emerald-400",
    closed_lost: "bg-gray-500/15 text-gray-400",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${colors[stage]}`}
    >
      {stage.replace("_", " ")} ({probability}%)
    </span>
  );
}

function DealCard({ deal }: { deal: DealItem }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">{deal.name}</h4>
        <span className="text-xs font-semibold">${deal.value.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <StageBadge stage={deal.stage} probability={deal.probability} />
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "—"}
        </span>
      </div>
    </div>
  );
}

function DealForm({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState<DealItem["stage"]>("prospecting");
  const [probability, setProbability] = useState("50");
  const org = getCurrentOrganization();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { name: string; value: number; stage: string; probability: number }) => {
      if (!org) throw new Error("No organization context");
      return dealService.create(
        {
          ...data,
          priority: "medium",
          pipelineId: "default",
          tenantId: org.id,
        } as any,
        org.id,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      onOpenChange(false);
      setName("");
      setValue("");
      setStage("prospecting");
      setProbability("50");
      onSuccess();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !value) return;
    mutation.mutate({ name, value: Number(value), stage, probability: Number(probability) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
          <Plus className="h-4 w-4" /> New deal
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Deal Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Enterprise License"
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Value ($)</label>
            <input
              required
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="100000"
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            >
              <option value="prospecting">Prospecting</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Probability (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={probability}
              onChange={(e) => setProbability(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50"
            >
              {mutation.isPending ? "Creating..." : "Create Deal"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminDealsPage() {
  const org = getCurrentOrganization();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    data: deals = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["deals", org?.id],
    queryFn: () => {
      if (!org) return Promise.resolve([]);
      return dealService.list(org.id);
    },
    enabled: !!org,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-muted-foreground">Loading deals...</span>
      </div>
    );
  }

  const dealsArray = deals.map((d) => ({
    ...d,
    stage: d.stage as DealItem["stage"],
  }));

  const forecast = dealsArray
    .filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost")
    .reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Deals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pipeline forecast: ${forecast.toLocaleString()} weighted value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search deals..."
              className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50 w-48"
            />
          </div>
          <DealForm open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={refetch} />
        </div>
      </header>

      {dealsArray.length === 0 && !isLoading ? (
        <EmptyState
          icon={<TrendingUp className="h-10 w-10" />}
          title="No deals yet"
          description="Create deals to start tracking your sales pipeline."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {["prospecting", "qualification", "proposal", "negotiation"].map((stage) => {
            const stageDeals = dealsArray.filter((d) => d.stage === (stage as DealItem["stage"]));
            return (
              <div key={stage} className="glass rounded-2xl p-4">
                <h3 className="font-semibold text-sm mb-3 capitalize">{stage}</h3>
                <div className="space-y-2">
                  {stageDeals.length > 0 ? (
                    stageDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                  ) : (
                    <p className="text-xs text-muted-foreground">No deals in {stage}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
