import { Bell } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";

export function NoNotificationsState() {
  return (
    <EmptyState
      icon={<Bell className="h-10 w-10" />}
      title="No notifications"
      description="You're all caught up. New notifications will appear here."
    />
  );
}
