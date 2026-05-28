import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Search, Plus } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { getCurrentOrganization } from "@/lib/tenant/context";

export const Route = createFileRoute("/admin/crm/contacts")({
  component: AdminContactsPage,
  head: () => ({
    meta: [
      { title: "Contacts | Admin Console" },
      { name: "description", content: "Manage customer contacts." },
    ],
  }),
});

function AdminContactsPage() {
  const org = getCurrentOrganization();
  const contacts: Array<{ id: string; firstName: string; lastName: string; email: string; type: string }> = [];

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
          <Link
            to="/admin/crm/contacts"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
          >
            <Plus className="h-4 w-4" /> Add contact
          </Link>
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
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{contact.firstName} {contact.lastName}</td>
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