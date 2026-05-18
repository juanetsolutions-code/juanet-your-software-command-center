import { createFileRoute } from "@tanstack/react-router";
import { Activity, FolderKanban, Wallet, KeyRound, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { ongoingProjects } from "@/lib/site";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome back, Jane</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening across your engagements.</p>
        </div>
        <button className="h-10 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary">
          + New Request
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active projects" value="4" delta="+1 this month" icon={FolderKanban} />
        <StatCard label="Open requests" value="7" delta="2 pending review" icon={Activity} accent="from-brand-blue to-brand-violet" />
        <StatCard label="Spend this month" value="$12,480" delta="On budget" icon={Wallet} accent="from-brand-violet to-brand-cyan" />
        <StatCard label="Active licenses" value="9" delta="All valid" icon={KeyRound} accent="from-brand-cyan to-brand-violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Project pipeline</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {ongoingProjects.slice(0, 5).map((p) => (
              <div key={p.id} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-5">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.category} • {p.due}</div>
                </div>
                <div className="col-span-5">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-2 text-right text-xs text-muted-foreground">{p.progress}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold">Recent activity</h2>
          <ul className="mt-5 space-y-4">
            {[
              { t: "Deploy", d: "atlas-core deployed to staging", time: "12m" },
              { t: "Message", d: "Marcus replied on Skyline LMS", time: "1h" },
              { t: "Invoice", d: "INV-1042 paid via M-Pesa", time: "3h" },
              { t: "License", d: "Pulse CRM key issued", time: "Yesterday" },
            ].map((a) => (
              <li key={a.d} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-cyan" />
                <div className="text-sm flex-1">
                  <div>{a.d}</div>
                  <div className="text-[11px] text-muted-foreground">{a.t} • {a.time} ago</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
