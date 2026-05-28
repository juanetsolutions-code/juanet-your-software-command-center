import { type ReactNode, useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

export interface GridColumn<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  width?: string;
  render?: (row: T) => ReactNode;
}

export interface UseGridResult<T> {
  sortedData: T[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  requestSort: (columnId: string) => void;
}

export function useGridSort<T>(data: T[], columns: GridColumn<T>[]): UseGridResult<T> {
  const [sortState, setSortState] = useState<{ columnId: string | null; direction: SortDirection }>(
    {
      columnId: null,
      direction: null,
    },
  );

  const sortedData = useMemo(() => {
    if (!sortState.columnId || !sortState.direction) return data;

    return [...data].sort((a, b) => {
      const column = columns.find((c) => c.id === sortState.columnId);
      if (!column) return 0;

      const aVal =
        typeof column.accessor === "function"
          ? column.accessor(a)
          : (a as Record<string, unknown>)[column.accessor as string];
      const bVal =
        typeof column.accessor === "function"
          ? column.accessor(b)
          : (b as Record<string, unknown>)[column.accessor as string];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortState.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortState.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [data, sortState, columns]);

  const requestSort = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (!column?.sortable) return;

    setSortState((prev) => {
      if (prev.columnId !== columnId) {
        return { columnId, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { columnId, direction: "desc" };
      }
      return { columnId: null, direction: null };
    });
  };

  return {
    sortedData,
    sortColumn: sortState.columnId,
    sortDirection: sortState.direction,
    requestSort,
  };
}
