import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, TrendingUp, Users, Briefcase } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";

export const Route = createFileRoute("/dashboard/crm/")({
  component: DashboardCrmPage,
  head: () => ({
    meta: [
      { title: "CRM | Client Portal" },
      { name: "description", content: "Your customer relationship dashboard." },
    ],
  }),
});

function DashboardCrmPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">CRM</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your leads and deals.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My leads" value="12" delta="3 new this week" icon={UserPlus} accent="from-brand-cyan to-brand-blue" />
        <StatCard label="My deals" value="$840k" delta="Across 8 deals" icon={TrendingUp} accent="from-brand-blue to-brand-violet" />
        <StatCard label="Pipeline value" value="$1.2M" delta="Forecast" icon={Briefcase} accent="from-brand-violet to-brand-cyan" />
        <StatCard label="Conversion rate" value="32%" delta="Your rate" icon={Users} accent="from-brand-cyan to-brand-blue" />
      </div>
    </div>
  );
}