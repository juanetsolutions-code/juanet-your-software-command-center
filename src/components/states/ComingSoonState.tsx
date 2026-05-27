import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface ComingSoonStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ComingSoonState({
  title = "Coming soon",
  description = "This feature is under active development. Check back later.",
  className,
}: ComingSoonStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl glass p-10 text-center",
        className,
      )}
    >
      <Clock className="h-10 w-10 text-brand-cyan mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
