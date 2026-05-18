import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CreditCard,
  Download,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { invoices } from "@/lib/site";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/payments")({
  component: PaymentsPage,
});

function formatMoney(amount: number, currency: "USD" | "KES") {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  return `KES ${amount.toLocaleString()}`;
}

function PaymentsPage() {
  const [paying, setPaying] = useState<string | null>(null);

  function handlePay(id: string) {
    setPaying(id);
    setTimeout(() => setPaying(null), 1800);
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
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary">
            <CreditCard className="h-4 w-4" /> Add payment method
          </button>
        </div>
      </header>

      {/* Billing overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Outstanding"
          value="$8,400"
          delta="1 invoice due"
          icon={Wallet}
        />
        <StatCard
          label="Paid this year"
          value="$48,720"
          delta="+18% YoY"
          icon={TrendingUp}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Avg. invoice"
          value="$4,180"
          delta="Across 12 projects"
          icon={Receipt}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Next billing"
          value="May 22"
          delta="Atlas Banking — Sprint 6"
          icon={CreditCard}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice table */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Invoices</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-medium py-2 px-5">Invoice</th>
                  <th className="text-left font-medium py-2 px-3 hidden md:table-cell">
                    Project
                  </th>
                  <th className="text-left font-medium py-2 px-3">Status</th>
                  <th className="text-right font-medium py-2 px-3">Amount</th>
                  <th className="text-right font-medium py-2 px-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-white/5 hover:bg-white/[0.03]"
                  >
                    <td className="py-3 px-5">
                      <div className="font-medium">{inv.id}</div>
                      <div className="text-[11px] text-muted-foreground md:hidden">
                        {inv.project}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Due {inv.due}
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell text-muted-foreground">
                      {inv.project}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {formatMoney(inv.amount, inv.currency)}
                    </td>
                    <td className="py-3 px-5 text-right">
                      {inv.status === "paid" ? (
                        <button className="h-8 px-3 text-xs rounded-md border border-white/10 hover:bg-white/5 inline-flex items-center gap-1.5">
                          <Download className="h-3 w-3" /> PDF
                        </button>
                      ) : inv.status === "draft" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <button
                          onClick={() => handlePay(inv.id)}
                          disabled={paying === inv.id}
                          className={cn(
                            "h-8 px-3 text-xs rounded-md font-medium inline-flex items-center gap-1.5 transition-all",
                            inv.status === "overdue"
                              ? "bg-rose-500/90 hover:bg-rose-500 text-white"
                              : "bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary",
                            paying === inv.id && "opacity-70",
                          )}
                        >
                          {paying === inv.id ? (
                            <>
                              <span className="h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin" />
                              Processing
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3 w-3" /> Pay now
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment methods */}
        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Payment methods</h3>
            <div className="mt-4 space-y-3">
              <MethodCard
                brand="VISA"
                last4="4242"
                expiry="08/27"
                primary
              />
              <MethodCard brand="M-PESA" last4="••• 7821" expiry="Active" />
            </div>
            <button className="mt-4 w-full h-9 rounded-md border border-dashed border-white/15 text-xs text-muted-foreground hover:text-foreground hover:border-white/25">
              + Add new method
            </button>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Billing address</h3>
            <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Juanet Client — Jane Ndegwa
              <br />
              Ngong Road, Suite 14
              <br />
              Nairobi 00100, Kenya
            </div>
            <button className="mt-4 text-xs text-brand-cyan hover:underline">
              Edit address
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MethodCard({
  brand,
  last4,
  expiry,
  primary,
}: {
  brand: string;
  last4: string;
  expiry: string;
  primary?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 border relative overflow-hidden",
        primary
          ? "border-brand-blue/40 bg-gradient-to-br from-brand-blue/10 to-brand-violet/10"
          : "border-white/10 bg-white/5",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
          {brand}
        </span>
        {primary && (
          <span className="text-[10px] uppercase tracking-wider text-brand-cyan">
            Primary
          </span>
        )}
      </div>
      <div className="mt-3 text-sm tracking-widest font-medium">•••• {last4}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">Exp {expiry}</div>
    </div>
  );
}
