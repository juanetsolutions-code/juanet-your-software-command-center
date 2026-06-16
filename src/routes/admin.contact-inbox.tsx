import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Mail, Trash2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import {
  listContactSubmissions,
  updateContactStatus,
  deleteContactSubmission,
  type ContactSubmission,
  type ContactStatus,
} from "@/lib/contact";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/contact-inbox")({
  head: () => ({
    meta: [
      { title: "Contact Inbox | Admin Console" },
      { name: "description", content: "Inbound inquiries from the public contact form." },
    ],
  }),
  component: ContactInboxPage,
});

const statusStyles: Record<ContactStatus, string> = {
  new: "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30",
  in_review: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  responded: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  archived: "bg-white/5 text-muted-foreground border-white/10",
};

function ContactInboxPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<ContactSubmission | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: listContactSubmissions,
    refetchInterval: 30_000,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["contact-submissions"] });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) =>
      updateContactStatus(id, status),
    onSuccess: () => {
      toast.success("Updated");
      invalidate();
    },
  });

  const del = useMutation({
    mutationFn: deleteContactSubmission,
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
  });

  const newCount = items.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6 text-brand-cyan" /> Contact Inbox
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {newCount > 0 ? `${newCount} new inquiry${newCount === 1 ? "" : "s"}` : "All caught up."}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No submissions yet.
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Company</th>
                <th className="px-4 py-2 font-medium">Budget</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Received</th>
                <th className="px-4 py-2 w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((i) => (
                <tr
                  key={i.id}
                  className="hover:bg-white/[0.03] cursor-pointer"
                  onClick={() => setOpen(i)}
                >
                  <td className="px-4 py-3 font-medium">{i.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.company ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.budget ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusStyles[i.status]}`}>
                      {i.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(i.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <a
                        href={`mailto:${i.email}?subject=Re:%20your%20Juanet%20inquiry`}
                        className="p-1.5 rounded hover:bg-white/10"
                        title="Reply by email"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          if (confirm("Delete this submission?")) del.mutate(i.id);
                        }}
                        className="p-1.5 rounded hover:bg-white/10 text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <a href={`mailto:${open.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
                    <Mail className="h-3 w-3" /> {open.email}
                  </a>
                  {open.company && <span>• {open.company}</span>}
                  {open.budget && <span>• Budget: {open.budget}</span>}
                  <span>• {new Date(open.createdAt).toLocaleString()}</span>
                </div>
                <div className="glass rounded-lg p-4 whitespace-pre-wrap">{open.message}</div>
                <div className="flex items-center gap-2 pt-2">
                  <label className="text-xs text-muted-foreground">Status:</label>
                  <select
                    value={open.status}
                    onChange={(e) =>
                      setStatus.mutate({ id: open.id, status: e.target.value as ContactStatus })
                    }
                    className="h-9 px-2 rounded-md bg-white/5 border border-border/60 text-sm outline-none"
                  >
                    <option value="new">New</option>
                    <option value="in_review">In review</option>
                    <option value="responded">Responded</option>
                    <option value="archived">Archived</option>
                  </select>
                  <a
                    href={`mailto:${open.email}?subject=Re:%20your%20Juanet%20inquiry`}
                    className="ml-auto h-9 px-3 inline-flex items-center gap-1 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Reply
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
