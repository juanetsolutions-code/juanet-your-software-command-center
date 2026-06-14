import { createFileRoute } from "@tanstack/react-router";
import { Building2, Activity, RefreshCw, CreditCard, Users } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { useQuery } from "@tanstack/react-query";
import { listOrgMembers } from "@/lib/admin-ops";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { data: members = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-org-members"],
    queryFn: listOrgMembers,
  });

  const owners = members.filter((m) => m.role === "owner").length;
  const admins = members.filter((m) => m.role === "admin").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Team Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Everyone in your organization workspace.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total members" value={String(members.length)} delta="In your org" icon={Users} />
        <StatCard label="Owners" value={String(owners)} delta="Full control" icon={Building2} accent="from-brand-blue to-brand-violet" />
        <StatCard label="Admins" value={String(admins)} delta="Privileged" icon={CreditCard} accent="from-brand-violet to-brand-cyan" />
        <StatCard label="Active" value={String(members.length)} delta="All seats" icon={Activity} accent="from-brand-cyan to-brand-violet" />
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Members</h2>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-6">Loading…</div>
        ) : members.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6">No members yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{m.fullName ?? "—"}</td>
                    <td className="py-3 text-muted-foreground">{m.email ?? "—"}</td>
                    <td className="py-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(m.joinedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
