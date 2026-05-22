import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, CreditCard, Download, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/app/StatCard";
import { InvoiceTable } from "@/components/dashboard/InvoiceTable";
import { PaymentMethodCard } from "@/components/dashboard/PaymentMethodCard";
import {
  getBillingAddress,
  getBillingOverview,
  listInvoices,
  listPaymentMethods,
  markInvoicePaid,
  type Invoice,
} from "@/lib/dashboard";

export const Route = createFileRoute("/dashboard/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const invoices = listInvoices();
  const methods = listPaymentMethods();
  const address = getBillingAddress();
  const overview = getBillingOverview();
  const [paying, setPaying] = useState<string | null>(null);

  function handlePay(invoice: Invoice) {
    setPaying(invoice.id);
    markInvoicePaid(invoice.id);
    setTimeout(() => setPaying(null), 1800);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Payments & Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your billing, invoices and payment methods.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary">
            <CreditCard className="h-4 w-4" /> Add payment method
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Outstanding"
          value={overview.outstandingLabel}
          delta={overview.outstandingHint}
          icon={Wallet}
        />
        <StatCard
          label="Paid this year"
          value={overview.paidYtdLabel}
          delta={overview.paidYtdHint}
          icon={TrendingUp}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Avg. invoice"
          value={overview.avgInvoiceLabel}
          delta={overview.avgInvoiceHint}
          icon={Receipt}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Next billing"
          value={overview.nextBillingLabel}
          delta={overview.nextBillingHint}
          icon={CreditCard}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Invoices</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <InvoiceTable invoices={invoices} payingId={paying} onPay={handlePay} />
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Payment methods</h3>
            <div className="mt-4 space-y-3">
              {methods.map((m) => (
                <PaymentMethodCard key={m.id} method={m} />
              ))}
            </div>
            <button className="mt-4 w-full h-9 rounded-md border border-dashed border-white/15 text-xs text-muted-foreground hover:text-foreground hover:border-white/25">
              + Add new method
            </button>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Billing address</h3>
            <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
              {address.name}
              {address.lines.map((l) => (
                <span key={l}>
                  <br />
                  {l}
                </span>
              ))}
            </div>
            <button className="mt-4 text-xs text-brand-cyan hover:underline">Edit address</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
