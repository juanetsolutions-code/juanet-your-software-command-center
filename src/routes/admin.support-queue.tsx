import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket, listTickets, updateTicketStatus } from "@/lib/admin-ops";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/support-queue")({
  component: SupportQueuePage,
});

const STATUSES = ["open", "in_progress", "waiting", "resolved", "closed"] as const;
const PRIORITIES = ["low", "normal", "high", "critical"] as const;

function SupportQueuePage() {
  const qc = useQueryClient();
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: listTickets,
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", customerName: "", customerEmail: "", priority: "normal" });

  const createMut = useMutation({
    mutationFn: () => createTicket(form),
    onSuccess: () => {
      toast.success("Ticket created");
      setOpen(false);
      setForm({ subject: "", customerName: "", customerEmail: "", priority: "normal" });
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateTicketStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tickets"] }),
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Support Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Open support tickets across all customers.</p>
        </div>
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-6 w-6 text-brand-cyan" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New ticket
          </button>
        </div>
      </header>

      {open && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold">New ticket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm md:col-span-2" placeholder="Subject"
              value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Customer name"
              value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            <input className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" placeholder="Customer email"
              value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            <select className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
              value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              disabled={!form.subject || createMut.isPending}
              onClick={() => createMut.mutate()}
              className="h-9 px-4 rounded-lg text-sm font-medium bg-brand-cyan/20 text-brand-cyan disabled:opacity-50"
            >
              {createMut.isPending ? "Saving…" : "Create"}
            </button>
            <button onClick={() => setOpen(false)} className="h-9 px-4 rounded-lg text-sm border border-white/10">Cancel</button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : tickets.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No tickets in the queue.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4">Ticket</th>
                <th className="text-left p-4">Subject</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Priority</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Age</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => {
                const age = Math.max(
                  0,
                  Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 3600000),
                );
                return (
                  <tr key={t.id} className="border-t border-white/5">
                    <td className="p-4 font-mono text-xs">{t.id.slice(0, 8)}</td>
                    <td className="p-4 font-medium">{t.subject}</td>
                    <td className="p-4">{t.customerName ?? "—"}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5">{t.priority}</span>
                    </td>
                    <td className="p-4">
                      <select
                        value={t.status}
                        onChange={(e) => statusMut.mutate({ id: t.id, status: e.target.value })}
                        className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-muted-foreground">{age}h</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
