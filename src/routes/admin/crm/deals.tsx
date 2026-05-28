import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Search, Plus, MoreHorizontal, DollarSign, Calendar, Clock } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";

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
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  probability: number;
  expectedClose?: string;
  assignedTo?: string;
  age: number;
};

const mockDeals: DealItem[] = [
  { id: "d1", name: "Enterprise License", value: 120000, stage: "proposal", probability: 75, expectedClose: "2024-03-15", age: 14 },
  { id: "d2", name: "Startup Package", value: 25000, stage: "negotiation", probability: 90, expectedClose: "2024-02-28", age: 21 },
  { id: "d3", name: "Pilot Program", value: 15000, stage: "prospecting", probability: 30, age: 5 },
];

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
    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${colors[stage]}`}>
      {stage.replace("_", " ")} ({probability}%)
    </span>
  );
}

function AdminDealsPage() {
  const deals = mockDeals;
  const forecast = deals.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost")
    .reduce((sum, d) => sum + (d.value * d.probability / 100), 0);

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
          <Link
            to="/admin/crm/deals"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
          >
            <Plus className="h-4 w-4" /> New deal
          </Link>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {["Prospecting", "Qualification", "Proposal", "Negotiation"].map((stage) => (
          <div key={stage} className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 capitalize">{stage}</h3>
            <div className="space-y-2">
              {deals.filter(d => d.stage.toLowerCase().replace("_", "") === stage.toLowerCase()).map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
              {deals.filter(d => d.stage.toLowerCase().replace("_", "") === stage.toLowerCase()).length === 0 && (
                <p className="text-xs text-muted-foreground">No deals in {stage.toLowerCase()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
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
          <Clock className="h-3 w-3" /> {deal.age}d
        </span>
      </div>
    </div>
  );
}