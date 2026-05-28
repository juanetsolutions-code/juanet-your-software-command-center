import { Search, Filter, Download, Columns } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GridToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filtersActive?: boolean;
  onFiltersClick?: () => void;
  columnCount?: number;
  onExport?: () => void;
  className?: string;
}

export function GridToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filtersActive,
  onFiltersClick,
  columnCount,
  onExport,
  className,
}: GridToolbarProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-9 pl-9 pr-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60"
        />
      </div>

      <button
        onClick={onFiltersClick}
        className={cn(
          "h-9 px-3 rounded-md text-sm border border-border/60 hover:bg-white/5 flex items-center gap-2",
          filtersActive && "bg-brand-blue/15 border-brand-blue/30",
        )}
      >
        <Filter className="h-4 w-4" />
        Filters
        {filtersActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />}
      </button>

      {onExport && (
        <button
          onClick={onExport}
          className="h-9 px-3 rounded-md text-sm border border-border/60 hover:bg-white/5 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      )}

      {columnCount && (
        <button className="h-9 px-3 rounded-md text-sm border border-border/60 hover:bg-white/5 flex items-center gap-2">
          <Columns className="h-4 w-4" />
          Columns
        </button>
      )}
    </div>
  );
}
