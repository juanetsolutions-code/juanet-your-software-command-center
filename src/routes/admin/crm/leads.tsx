import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { UserPlus, Search, Plus, MoreHorizontal, Tag, Calendar, User, Check, X } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";

export const Route = createFileRoute("/admin/crm/leads")({
  component: AdminLeadsPage,
  head: () => ({
    meta: [
      { title: "Leads | Admin Console" },
      { name: "description", content: "Manage sales leads with full lifecycle workflows." },
    ],
  }),
});

type LeadItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: "new" | "qualified" | "contacted" | "converted" | "rejected";
  score: number;
  assignedTo?: string;
  lastContacted?: string;
  nextFollowUp?: string;
  tags: string[];
};

const mockLeads: LeadItem[] = [
  { id: "l1", firstName: "Alex", lastName: "Johnson", email: "alex@example.com", company: "TechCorp", source: "website", status: "new", score: 85, tags: ["hot"] },
  { id: "l2", firstName: "Maria", lastName: "Garcia", email: "maria@company.com", company: "DesignCo", source: "referral", status: "contacted", score: 62, tags: [] },
  { id: "l3", firstName: "James", lastName: "Wilson", email: "james@biz.com", company: "BizGroup", source: "social", status: "qualified", score: 45, tags: ["warm"] },
];

function StatusBadge({ status }: { status: LeadItem["status"] }) {
  const colors = {
    new: "bg-blue-500/15 text-blue-400",
    contacted: "bg-amber-500/15 text-amber-400",
    qualified: "bg-green-500/15 text-green-400",
    converted: "bg-purple-500/15 text-purple-400",
    rejected: "bg-gray-500/15 text-gray-400",
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-gray-400";
  return <span className={`text-xs font-medium ${color}`}>{score}</span>;
}

function AdminLeadsPage() {
  const leads = mockLeads;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Full lead lifecycle management with quick actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search leads..."
              className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50 w-48"
            />
          </div>
          <select className="h-10 px-3 rounded-lg text-sm bg-white/5 border border-white/10">
            <option>All statuses</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
          </select>
          <Link
            to="/admin/crm/leads"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
          >
            <Plus className="h-4 w-4" /> Add lead
          </Link>
        </div>
      </header>

      {leads.length === 0 ? (
        <EmptyState
          icon={<UserPlus className="h-10 w-10" />}
          title="No leads yet"
          description="Start capturing leads to build your pipeline."
        />
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Company</th>
                <th className="py-3 px-4 font-medium">Source</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Score</th>
                <th className="py-3 px-4 font-medium">Next Action</th>
                <th className="py-2 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-medium">{lead.firstName} {lead.lastName}</td>
                  <td className="py-3 px-4 text-muted-foreground">{lead.company || "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground capitalize">{lead.source}</td>
                  <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
                  <td className="py-3 px-4"><ScoreBadge score={lead.score} /></td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-white/10 rounded">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}