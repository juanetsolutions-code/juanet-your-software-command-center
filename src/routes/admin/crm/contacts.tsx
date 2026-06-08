import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Plus, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useState, type FormEvent } from "react";
import { crmService } from "@/lib/crm/services/crm-service";
import { getCurrentOrganization } from "@/lib/tenant/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<ContactType>("customer");
  const org = getCurrentOrganization();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { firstName: string; lastName: string; email: string; phone?: string; type: ContactType }) => {
      if (!org) throw new Error("No organization context");
      return crmService.contacts.create({ ...data, tenantId: org.id } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      onOpenChange(false);
      onSuccess();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;
    mutation.mutate({ firstName, lastName, email, phone, type });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>

      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">First Name</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Last Name</label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContactType)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50 mt-1"
            >
              <option value="customer">Customer</option>
              <option value="prospect">Prospect</option>
              <option value="partner">Partner</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50"
            >
              {mutation.isPending ? "Creating..." : "Create Contact"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminContactsPage() {
  const org = getCurrentOrganization();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    data: contactsResult = { contacts: [], total: 0, hasMore: false },
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["contacts", org?.id],
    queryFn: async () => {
      if (!org) return { contacts: [], total: 0, hasMore: false };
      return crmService.contacts.query({ tenantId: org.id });
    },
    enabled: !!org,
  });

  const contacts = contactsResult.contacts;


  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All customer contacts and stakeholders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search contacts..."
              className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50"
            />
          </div>
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90">
            <Plus className="h-4 w-4" /> Add contact
          </button>
        </div>
      </header>

      {contacts.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No contacts yet"
          description="Add contacts to manage relationships."
        />
      ) : (
        <div className="glass rounded-2xl p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {contacts.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td className="py-3 text-muted-foreground">{contact.email}</td>
                  <td className="py-3">{contact.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
