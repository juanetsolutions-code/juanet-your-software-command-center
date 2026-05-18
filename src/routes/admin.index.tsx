import { createFileRoute } from "@tanstack/react-router";
import { Users, FolderKanban, DollarSign, Activity } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { ongoingProjects } from "@/lib/site";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

const users = [
  { name: "Atlas Financial", email: "ops@atlas.fin", plan: "Enterprise", status: "Active" },
  { name: "Nairobi Health", email: "it@nbi-health.org", plan: "Pro", status: "Active" },
  { name: "Greenfields Co.", email: "tech@greenfields.co", plan: "Pro", status: "Trial" },
  { name: "Skyline Academy", email: "admin@skyline.ac", plan: "Standard", status: "Active" },
  { name: "Urban Retail", email: "cto@urbanretail.io", plan: "Pro", status: "Active" },
];

function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Operational metrics across the Juanet platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value="1,284" delta="+42 this week" icon={Users} />
        <StatCard label="Active projects" value="23" delta="6 launching" icon={FolderKanban} accent="from-brand-blue to-brand-violet" />
        <StatCard label="MRR" value="$48,210" delta="+8.2% MoM" icon={DollarSign} accent="from-brand-violet to-brand-cyan" />
        <StatCard label="System uptime" value="99.99%" delta="Last 30 days" icon={Activity} accent="from-brand-cyan to-brand-violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h2 className="font-semibold">Project portfolio</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Project</th>
                  <th className="py-2 font-medium">Client</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ongoingProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.client}</td>
                    <td className="py-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand-blue/15 text-brand-cyan">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">{p.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold">Recent users</h2>
          <ul className="mt-5 divide-y divide-border/60">
            {users.map((u) => (
              <li key={u.email} className="py-3 flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet grid place-items-center text-[11px] font-semibold">
                  {u.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{u.plan}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Orders today", v: "38" },
          { l: "Refunds", v: "2" },
          { l: "Licenses issued", v: "112" },
          { l: "Tickets open", v: "5" },
        ].map((k) => (
          <div key={k.l} className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className="mt-2 text-xl font-semibold">{k.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
