import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface NoResultsStateProps {
  query?: string;
  onClear?: () => void;
  className?: string;
}

export function NoResultsState({ query, onClear, className }: NoResultsStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl glass p-10 text-center",
        className,
      )}
    >
      <Search className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">No results found</h3>
      {query && <p className="mt-2 text-sm text-muted-foreground">No matches for "{query}"</p>}
      {onClear && (
        <button
          onClick={onClear}
          className="mt-6 h-9 px-4 rounded-md bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
