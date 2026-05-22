import { motion } from "framer-motion";
import { CreditCard, Download } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";
import { cn } from "@/lib/utils";
import type { Currency, Invoice } from "@/lib/dashboard";

function formatMoney(amount: number, currency: Currency) {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  return `KES ${amount.toLocaleString()}`;
}

export interface InvoiceTableProps {
  invoices: Invoice[];
  payingId?: string | null;
  onPay?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
}

export function InvoiceTable({ invoices, payingId, onPay, onDownload }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="text-left font-medium py-2 px-5">Invoice</th>
            <th className="text-left font-medium py-2 px-3 hidden md:table-cell">Project</th>
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
                <div className="text-[11px] text-muted-foreground md:hidden">{inv.projectName}</div>
                <div className="text-[11px] text-muted-foreground">Due {inv.dueLabel}</div>
              </td>
              <td className="py-3 px-3 hidden md:table-cell text-muted-foreground">
                {inv.projectName}
              </td>
              <td className="py-3 px-3">
                <StatusBadge status={inv.status} />
              </td>
              <td className="py-3 px-3 text-right font-medium">
                {formatMoney(inv.amount, inv.currency)}
              </td>
              <td className="py-3 px-5 text-right">
                {inv.status === "paid" ? (
                  <button
                    onClick={() => onDownload?.(inv)}
                    className="h-8 px-3 text-xs rounded-md border border-white/10 hover:bg-white/5 inline-flex items-center gap-1.5"
                  >
                    <Download className="h-3 w-3" /> PDF
                  </button>
                ) : inv.status === "draft" ? (
                  <span className="text-xs text-muted-foreground">—</span>
                ) : (
                  <button
                    onClick={() => onPay?.(inv)}
                    disabled={payingId === inv.id}
                    className={cn(
                      "h-8 px-3 text-xs rounded-md font-medium inline-flex items-center gap-1.5 transition-all",
                      inv.status === "overdue"
                        ? "bg-rose-500/90 hover:bg-rose-500 text-white"
                        : "bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary",
                      payingId === inv.id && "opacity-70",
                    )}
                  >
                    {payingId === inv.id ? (
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
  );
}
