import { Activity } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";

export function NoActivityState() {
  return (
    <EmptyState
      icon={<Activity className="h-10 w-10" />}
      title="No activity yet"
      description="Platform activity will appear here as events occur."
    />
  );
}