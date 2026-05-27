import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-10", className)}>
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-brand-cyan animate-spin" />
        <div
          className="absolute inset-0 h-10 w-10 rounded-full border-2 border-transparent border-t-brand-blue animate-spin"
          style={{ animationDelay: "0.1s" }}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
