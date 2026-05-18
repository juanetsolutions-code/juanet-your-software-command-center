import type { ActivityItem } from "@/lib/dashboard";

const kindLabel: Record<ActivityItem["kind"], string> = {
  deploy: "Deploy",
  message: "Message",
  invoice: "Invoice",
  license: "License",
  request: "Request",
};

export interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <ul className="mt-5 space-y-4">
      {items.map((a) => (
        <li key={a.id} className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-brand-cyan" />
          <div className="text-sm flex-1">
            <div>{a.text}</div>
            <div className="text-[11px] text-muted-foreground">
              {kindLabel[a.kind]} • {a.timeLabel}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
