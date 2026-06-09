import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Plus, TrendingUp, UserPlus, Briefcase } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { useQuery } from "@tanstack/react-query";
import { leadService } from "@/lib/crm/services/lead-service";
import { dealService } from "@/lib/crm/services/deal-service";
import { useOrganizationId } from "@/lib/tenant/useOrganization";

export const Route = createFileRoute("/admin/crm/")({
  component: AdminCrmPage,
  head: () => ({
    meta: [
      { title: "CRM | Admin Console" },
      { name: "description", content: "Customer relationship management dashboard." },
    ],
  }),
});

function AdminCrmPage() {
  const { data: orgId } = useOrganizationId();
  const { data: leads = [] } = useQuery({
    queryKey: ["leads", orgId], queryFn: () => leadService.list(orgId!), enabled: !!orgId,
  });
  const { data: deals = [] } = useQuery({
    queryKey: ["deals", orgId], queryFn: () => dealService.list(orgId!), enabled: !!orgId,
  });

  const totalLeads = leads.length;
  const newThisMonth = leads.filter((l) => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const activeDeals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");
  const dealsValue = activeDeals.reduce((s, d) => s + d.value, 0);
  const forecast = activeDeals.reduce((s, d) => s + (d.value * d.probability) / 100, 0);
  const won = deals.filter((d) => d.stage === "closed_won").length;
  const convRate = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage leads, contacts, deals, and pipelines.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/crm/leads" className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">Leads</Link>
          <Link to="/admin/crm/leads" className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
            <Plus className="h-4 w-4" /> New lead
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={String(totalLeads)} delta={`${newThisMonth} new this month`} icon={UserPlus} accent="from-brand-cyan to-brand-blue" />
        <StatCard label="Active deals" value={String(activeDeals.length)} delta={`$${dealsValue.toLocaleString()} pipeline`} icon={TrendingUp} accent="from-brand-blue to-brand-violet" />
        <StatCard label="Conversion rate" value={`${convRate}%`} delta={`${won} won`} icon={Briefcase} accent="from-brand-violet to-brand-cyan" />
        <StatCard label="Forecast" value={`$${Math.round(forecast).toLocaleString()}`} delta="Weighted value" icon={Users} accent="from-brand-cyan to-brand-blue" />
      </div>
    </div>
  );
}
