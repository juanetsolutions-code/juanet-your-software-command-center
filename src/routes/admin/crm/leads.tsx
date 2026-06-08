import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Search, Plus, MoreHorizontal, Calendar } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useState, type FormEvent } from "react";
import { leadService } from "@/lib/crm/services/lead-service";
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

export const Route = createFileRoute("/admin/crm/leads")({
  component: AdminLeadsPage,
  head: () => ({
    meta: [
      { title: "Leads | Admin Console" },
      { name: "description", content: "Manage sales leads with full lifecycle workflows." },
    ],
  }),
});

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-500/15 text-blue-400",
    contacted: "bg-amber-500/15 text-amber-400",
    qualified: "bg-green-500/15 text-green-400",
    converted: "bg-purple-500/15 text-purple-400",
    rejected: "bg-gray-500/15 text-gray-400",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${colors[status] || colors.new}`}
    >
      {status}
    </span>
  );
}

function ScoreBadge({ score }: { score?: number }) {
  const numericScore = score ?? 0;
  const color =
    numericScore >= 80 ? "text-green-400" : numericScore >= 50 ? "text-amber-400" : "text-gray-400";
  return <span className={`text-xs font-medium ${color}`}>{numericScore}</span>;
}

function LeadForm({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState<
    "website" | "referral" | "social" | "email" | "call" | "event" | "other"
  >("website");
  const org = getCurrentOrganization();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      company?: string;
      source: string;
    }) => {
      if (!org) throw new Error("No organization context");
      return leadService.create(data as any, org.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
      onSuccess();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;
    mutation.mutate({ firstName, lastName, email, phone, company, source });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
          <Plus className="h-4 w-4" /> Add lead
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">First Name</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Last Name</label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            >
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social">Social</option>
              <option value="email">Email</option>
              <option value="call">Call</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
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
              {mutation.isPending ? "Creating..." : "Create Lead"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminLeadsPage() {
  const org = getCurrentOrganization();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    data: leads = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["leads", org?.id],
    queryFn: () => {
      if (!org) return Promise.resolve([]);
      return leadService.list(org.id);
    },
    enabled: !!org,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-muted-foreground">Loading leads...</span>
      </div>
    );
  }

  const leadsArray = leads ?? [];

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
          <LeadForm open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={refetch} />
        </div>
      </header>

      {leadsArray.length === 0 && !isLoading ? (
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
              {leadsArray.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-medium">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{lead.company || "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground capitalize">{lead.source}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3 px-4">
                    <ScoreBadge score={lead.score} />
                  </td>
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
