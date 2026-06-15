import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Download, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StatCard } from "@/components/app/StatCard";
import { InvoiceTable } from "@/components/dashboard/InvoiceTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  listMyInvoices,
  markInvoicePaid,
  getBillingAddress,
  upsertBillingAddress,
} from "@/lib/client-dashboard";
import type { Invoice } from "@/lib/dashboard";

export const Route = createFileRoute("/dashboard/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const qc = useQueryClient();
  const [paying, setPaying] = useState<string | null>(null);
  const [editAddrOpen, setEditAddrOpen] = useState(false);

  const { data: invoicesRaw = [], isLoading } = useQuery({
    queryKey: ["my-invoices"],
    queryFn: listMyInvoices,
  });
  const { data: address } = useQuery({
    queryKey: ["billing-address"],
    queryFn: getBillingAddress,
  });

  const invoices: Invoice[] = invoicesRaw.map((r) => ({
    id: r.number || r.id,
    projectName: r.projectName ?? "—",
    amount: r.amount,
    currency: (r.currency as "USD" | "KES") ?? "USD",
    status: r.status as Invoice["status"],
    issuedLabel: new Date(r.createdAt).toLocaleDateString(),
    dueLabel: r.dueAt ? new Date(r.dueAt).toLocaleDateString() : "—",
  }));

  const outstanding = invoicesRaw
    .filter((i) => i.status === "pending" || i.status === "due" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);
  const paidYtd = invoicesRaw.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const avg =
    invoicesRaw.length > 0
      ? Math.round(invoicesRaw.reduce((s, i) => s + i.amount, 0) / invoicesRaw.length)
      : 0;

  const pay = useMutation({
    mutationFn: async (id: string) => {
      const inv = invoicesRaw.find((x) => (x.number || x.id) === id);
      if (!inv) return;
      await markInvoicePaid(inv.id);
    },
    onSuccess: () => {
      toast.success("Invoice marked as paid");
      qc.invalidateQueries({ queryKey: ["my-invoices"] });
    },
  });

  function handlePay(invoice: Invoice) {
    setPaying(invoice.id);
    pay.mutate(invoice.id, {
      onSettled: () => setTimeout(() => setPaying(null), 800),
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Payments & Invoices
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your billing, invoices and payment methods.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csv = [
                ["Number", "Project", "Status", "Amount", "Currency", "Due"].join(","),
                ...invoicesRaw.map((i) =>
                  [i.number, i.projectName ?? "", i.status, i.amount, i.currency, i.dueAt ?? ""].join(","),
                ),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success("Exported");
            }}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding" value={`$${outstanding.toLocaleString()}`} icon={Wallet} />
        <StatCard
          label="Paid this year"
          value={`$${paidYtd.toLocaleString()}`}
          icon={TrendingUp}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Avg. invoice"
          value={`$${avg.toLocaleString()}`}
          icon={Receipt}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Total invoices"
          value={String(invoicesRaw.length)}
          icon={CreditCard}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Invoices</h2>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : (
            <InvoiceTable invoices={invoices} payingId={paying} onPay={handlePay} />
          )}
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Billing address</h3>
            {address ? (
              <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {address.fullName}
                <br />
                {address.line1}
                {address.line2 && <><br />{address.line2}</>}
                {(address.city || address.region) && (
                  <><br />{[address.city, address.region, address.postalCode].filter(Boolean).join(", ")}</>
                )}
                {address.country && <><br />{address.country}</>}
              </div>
            ) : (
              <div className="mt-3 text-xs text-muted-foreground">No billing address on file.</div>
            )}
            <button
              onClick={() => setEditAddrOpen(true)}
              className="mt-4 text-xs text-brand-cyan hover:underline"
            >
              {address ? "Edit address" : "Add address"}
            </button>
          </div>
        </aside>
      </div>

      <AddressDialog
        open={editAddrOpen}
        onOpenChange={setEditAddrOpen}
        initial={address ?? null}
        onSaved={() => qc.invalidateQueries({ queryKey: ["billing-address"] })}
      />
    </div>
  );
}

function AddressDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: Awaited<ReturnType<typeof getBillingAddress>>;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [line1, setLine1] = useState(initial?.line1 ?? "");
  const [line2, setLine2] = useState(initial?.line2 ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!fullName || !line1) {
      toast.error("Full name and address line 1 are required");
      return;
    }
    setSaving(true);
    try {
      await upsertBillingAddress({ fullName, line1, line2, city, region, postalCode, country });
      toast.success("Billing address saved");
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Billing address</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <input className="h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm" placeholder="Address line 1" value={line1} onChange={(e) => setLine1(e.target.value)} />
          <input className="h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm" placeholder="Address line 2 (optional)" value={line2 ?? ""} onChange={(e) => setLine2(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm" placeholder="City" value={city ?? ""} onChange={(e) => setCity(e.target.value)} />
            <input className="h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm" placeholder="Region / State" value={region ?? ""} onChange={(e) => setRegion(e.target.value)} />
            <input className="h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm" placeholder="Postal code" value={postalCode ?? ""} onChange={(e) => setPostalCode(e.target.value)} />
            <input className="h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm" placeholder="Country" value={country ?? ""} onChange={(e) => setCountry(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-md text-sm border border-white/10 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
