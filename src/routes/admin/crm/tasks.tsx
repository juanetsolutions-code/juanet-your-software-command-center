import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Search, Plus, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService, type CrmTask } from "@/lib/crm/tasks/task-service";
import { leadService } from "@/lib/crm/services/lead-service";
import { useOrganizationId } from "@/lib/tenant/useOrganization";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/crm/tasks")({
  component: AdminTasksPage,
  head: () => ({
    meta: [
      { title: "Tasks | Admin Console" },
      { name: "description", content: "Manage sales follow-up tasks." },
    ],
  }),
});

function TaskForm({ orgId, open, onOpenChange }: { orgId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<CrmTask["priority"]>("medium");
  const [leadId, setLeadId] = useState<string>("");
  const qc = useQueryClient();

  const { data: leads = [] } = useQuery({
    queryKey: ["leads", orgId],
    queryFn: () => leadService.list(orgId),
    enabled: !!orgId,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!leadId) throw new Error("Pick a lead to attach this task to");
      return taskService.create(orgId, {
        title, description, entityType: "lead", entityId: leadId,
        dueDate: dueDate || undefined, priority,
      });
    },
    onSuccess: () => {
      toast.success("Task created");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      onOpenChange(false);
      setTitle(""); setDescription(""); setDueDate(""); setPriority("medium"); setLeadId("");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title) return;
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
          <Plus className="h-4 w-4" /> Add task
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Due Date</label>
              <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as CrmTask["priority"])} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Linked Lead</label>
            <select required value={leadId} onChange={(e) => setLeadId(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1">
              <option value="">— Select a lead —</option>
              {leads.map((l) => <option key={l.id} value={l.id}>{l.firstName} {l.lastName} {l.company ? `(${l.company})` : ""}</option>)}
            </select>
          </div>
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50">
              {mutation.isPending ? "Creating..." : "Create Task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminTasksPage() {
  const { data: orgId, isLoading: orgLoading } = useOrganizationId();
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", orgId],
    queryFn: () => taskService.getAll(orgId!),
    enabled: !!orgId,
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CrmTask["status"] }) =>
      taskService.setStatus(id, status, orgId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  if (orgLoading || isLoading) {
    return <div className="flex items-center justify-center p-8"><span className="text-muted-foreground">Loading tasks...</span></div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Follow-up tasks and to-dos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Search tasks..." className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50 w-48" />
          </div>
          {orgId && <TaskForm orgId={orgId} open={open} onOpenChange={setOpen} />}
        </div>
      </header>

      {tasks.length === 0 ? (
        <EmptyState icon={<CalendarDays className="h-10 w-10" />} title="No tasks yet" description="Create follow-up tasks linked to your leads." />
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-3 px-4 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Due</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-medium">{t.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</td>
                  <td className="py-3 px-4 capitalize">{t.priority}</td>
                  <td className="py-3 px-4 capitalize">{t.status}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="h-4 w-4" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatus.mutate({ id: t.id, status: "in_progress" })}>Mark in progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus.mutate({ id: t.id, status: "completed" })}>Mark completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus.mutate({ id: t.id, status: "cancelled" })}>Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
