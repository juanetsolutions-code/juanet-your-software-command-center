import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/dashboard";

export interface PaymentMethodCardProps {
  method: PaymentMethod;
}

export function PaymentMethodCard({ method }: PaymentMethodCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 border relative overflow-hidden",
        method.primary
          ? "border-brand-blue/40 bg-gradient-to-br from-brand-blue/10 to-brand-violet/10"
          : "border-white/10 bg-white/5",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
          {method.brand}
        </span>
        {method.primary && (
          <span className="text-[10px] uppercase tracking-wider text-brand-cyan">Primary</span>
        )}
      </div>
      <div className="mt-3 text-sm tracking-widest font-medium">•••• {method.last4}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">Exp {method.expiryLabel}</div>
    </div>
  );
}
