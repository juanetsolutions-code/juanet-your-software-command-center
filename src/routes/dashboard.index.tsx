import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, FolderKanban, MessageSquare, Wallet } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ProjectPipelineRow } from "@/components/dashboard/ProjectPipelineRow";
import { getDashboardSummary, listProjects, listRecentActivity } from "@/lib/dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function formatMoney(amount: number, currency: "USD" | "KES") {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  return `KES ${amount.toLocaleString()}`;
}

function DashboardHome() {
  const summary = getDashboardSummary();
  const projects = listProjects().slice(0, 5);
  const activity = listRecentActivity();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome back, Jane</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening across your engagements.
          </p>
        </div>
        <Link
          to="/dashboard/requests"
          className="h-10 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary"
        >
          + New Request
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Active projects"
          value={String(summary.activeProjects)}
          delta="+1 this month"
          icon={FolderKanban}
        />
        <StatCard
          label="Open requests"
          value={String(summary.openRequests)}
          delta="2 pending review"
          icon={Activity}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Unread messages"
          value={String(summary.unreadMessages)}
          delta="2 from Marcus"
          icon={MessageSquare}
          accent="from-brand-cyan to-brand-violet"
        />
        <StatCard
          label="Outstanding"
          value={formatMoney(summary.outstandingAmount.amount, summary.outstandingAmount.currency)}
          delta="Due May 22"
          icon={Wallet}
          accent="from-brand-violet to-brand-cyan"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Project pipeline</h2>
            <Link
              to="/dashboard/projects"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {projects.map((p, i) => (
              <ProjectPipelineRow key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold">Recent activity</h2>
          <ActivityFeed items={activity} />
        </div>
      </div>
    </div>
  );
}
