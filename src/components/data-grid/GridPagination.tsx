import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GridPaginationProps {
  pageCount: number;
  pageIndex: number;
  onPageChange: (pageIndex: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  className?: string;
}

export function GridPagination({
  pageCount,
  pageIndex,
  onPageChange,
  canPreviousPage,
  canNextPage,
  className,
}: GridPaginationProps) {
  return (
    <div className={cn("flex items-center justify-between mt-4", className)}>
      <div className="text-sm text-muted-foreground">
        Page {pageIndex + 1} of {pageCount}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={!canPreviousPage}
          className="h-8 w-8 rounded-md border border-border/60 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={!canNextPage}
          className="h-8 w-8 rounded-md border border-border/60 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
