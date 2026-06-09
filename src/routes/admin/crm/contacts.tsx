import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Plus, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useState, type FormEvent } from "react";
import { crmService } from "@/lib/crm/services/crm-service";
import { useOrganizationId } from "@/lib/tenant/useOrganization";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { ContactType } from "@/lib/crm/core/crm-types";

export const Route = createFileRoute("/admin/crm/contacts")({
  component: AdminContactsPage,
  head: () => ({
    meta: [
      { title: "Contacts | Admin Console" },
      { name: "description", content: "Manage customer contacts." },
    ],
  }),
});

function ContactForm({
  orgId, open, onOpenChange,
}: { orgId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<ContactType>("customer");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      crmService.contacts.create({ tenantId: orgId, firstName, lastName, email, phone, type }),
    onSuccess: () => {
      toast.success("Contact created");
      qc.invalidateQueries({ queryKey: ["contacts"] });
      onOpenChange(false);
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setType("customer");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add New Contact</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">First Name</label>
              <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Last Name</label>
              <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as ContactType)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1">
              <option value="customer">Customer</option>
              <option value="lead">Lead</option>
              <option value="partner">Partner</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50">
              {mutation.isPending ? "Creating..." : "Create Contact"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminContactsPage() {
  const { data: orgId, isLoading: orgLoading } = useOrganizationId();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const { data: result = { contacts: [], total: 0, hasMore: false }, isLoading } = useQuery({
    queryKey: ["contacts", orgId],
    queryFn: () => crmService.contacts.query({ tenantId: orgId! }),
    enabled: !!orgId,
  });

  const remove = useMutation({
    mutationFn: (id: string) => crmService.contacts.remove(id, orgId!),
    onSuccess: () => {
      toast.success("Contact deleted");
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const contacts = result.contacts.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  if (orgLoading || isLoading) {
    return <div className="flex items-center justify-center p-8"><span className="text-muted-foreground">Loading contacts...</span></div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">All customer contacts and stakeholders.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50" />
          </div>
          <button onClick={() => setShowAddDialog(true)} className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
            <Plus className="h-4 w-4" /> Add contact
          </button>
          {orgId && <ContactForm orgId={orgId} open={showAddDialog} onOpenChange={setShowAddDialog} />}
        </div>
      </header>

      {contacts.length === 0 ? (
        <EmptyState icon={<Users className="h-10 w-10" />} title="No contacts yet" description="Add contacts to manage relationships." />
      ) : (
        <div className="glass rounded-2xl p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Phone</th>
                <th className="py-2 font-medium">Type</th>
                <th className="py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{c.firstName} {c.lastName}</td>
                  <td className="py-3 text-muted-foreground">{c.email}</td>
                  <td className="py-3 text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="py-3 capitalize">{c.type}</td>
                  <td className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="h-4 w-4" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => remove.mutate(c.id)} className="text-red-400">Delete</DropdownMenuItem>
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
