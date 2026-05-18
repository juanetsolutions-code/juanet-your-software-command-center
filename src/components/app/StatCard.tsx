import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "from-brand-cyan to-brand-blue",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl"
        style={{ background: `linear-gradient(135deg, var(--brand-blue), var(--brand-violet))` }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={cn("mt-2 text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent", accent)}>
            {value}
          </div>
          {delta && <div className="mt-1 text-[11px] text-brand-cyan">{delta}</div>}
        </div>
        <span className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 border border-white/10">
          <Icon className="h-4 w-4 text-brand-cyan" />
        </span>
      </div>
    </div>
  );
}
