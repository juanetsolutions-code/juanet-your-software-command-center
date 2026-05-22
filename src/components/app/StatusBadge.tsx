import { cn } from "@/lib/utils";

type Status = "pending" | "in progress" | "completed" | "paid" | "due" | "overdue" | "draft";

const styles: Record<Status, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-400/20",
  "in progress": "bg-sky-500/10 text-sky-300 border-sky-400/20",
  completed: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  paid: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  due: "bg-amber-500/10 text-amber-300 border-amber-400/20",
  overdue: "bg-rose-500/10 text-rose-300 border-rose-400/20",
  draft: "bg-white/5 text-muted-foreground border-white/10",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
