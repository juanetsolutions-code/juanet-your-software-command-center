import { createFileRoute } from "@tanstack/react-router";
import { 
  UserPlus, 
  TrendingUp, 
  Briefcase, 
  Users, 
  Calendar,
  DollarSign,
  Target,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { getCurrentOrganization } from "@/lib/tenant/context";

export const Route = createFileRoute("/admin/crm/dashboard")({
  component: AdminCrmDashboard,
  head: () => ({
    meta: [
      { title: "CRM Dashboard | Admin Console" },
      { name: "description", content: "Sales performance overview and metrics." },
    ],
  }),
});

function AdminCrmDashboard() {
  const org = getCurrentOrganization();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">CRM Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sales performance overview and pipeline metrics.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Leads" 
          value="142" 
          delta="28 this month" 
          icon={UserPlus} 
          accent="from-brand-cyan to-brand-blue" 
        />
        <StatCard 
          label="Active Deals" 
          value="32" 
          delta="4 closing soon" 
          icon={Briefcase} 
          accent="from-brand-blue to-brand-violet" 
        />
        <StatCard 
          label="Pipeline Value" 
          value="$8.2M" 
          delta="Forecast" 
          icon={DollarSign} 
          accent="from-brand-violet to-brand-cyan" 
        />
        <StatCard 
          label="Win Rate" 
          value="24%" 
          delta="+4% vs last quarter" 
          icon={Target} 
          accent="from-brand-cyan to-brand-blue" 
        />
        <StatCard 
          label="Revenue" 
          value="$2.4M" 
          delta="This quarter" 
          icon={TrendingUp} 
          accent="from-brand-pink to-brand-rose" 
        />
        <StatCard 
          label="Conversion" 
          value="18%" 
          delta="Lead to deal" 
          icon={Activity} 
          accent="from-brand-rose to-brand-cyan" 
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Upcoming Follow-ups</h2>
        <p className="text-sm text-muted-foreground">No upcoming follow-ups scheduled.</p>
      </div>
    </div>
  );
}