import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export interface PermissionDeniedStateProps {
  module?: string;
  action?: string;
  className?: string;
}

export function PermissionDeniedState({ module, action, className }: PermissionDeniedStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl glass p-10 text-center",
        className,
      )}
    >
      <Lock className="h-10 w-10 text-brand-cyan mb-4" />
      <h3 className="text-lg font-semibold">Access restricted</h3>
      {module && action && (
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to {action} {module}.
        </p>
      )}
      <p className="mt-2 text-sm text-muted-foreground">Contact your administrator for access.</p>
    </div>
  );
}
