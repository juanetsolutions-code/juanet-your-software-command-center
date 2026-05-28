import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Plus, TrendingUp, UserPlus, Briefcase } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { getCurrentOrganization } from "@/lib/tenant/context";

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
  const org = getCurrentOrganization();

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage leads, contacts, deals, and pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/crm/leads"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
          >
            Leads
          </Link>
          <Link
            to="/admin/crm/leads"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
          >
            <Plus className="h-4 w-4" /> New lead
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value="142" delta="28 new this month" icon={UserPlus} accent="from-brand-cyan to-brand-blue" />
        <StatCard label="Deals" value="$2.4M" delta="Across 32 deals" icon={TrendingUp} accent="from-brand-blue to-brand-violet" />
        <StatCard label="Conversion rate" value="24%" delta="+4% from last month" icon={Briefcase} accent="from-brand-violet to-brand-cyan" />
        <StatCard label="Pipeline" value="$8.2M" delta="Forecast value" icon={Users} accent="from-brand-cyan to-brand-blue" />
      </div>
    </div>
  );
}