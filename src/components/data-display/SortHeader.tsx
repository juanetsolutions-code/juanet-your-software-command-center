import { type ReactNode, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface SortableColumnProps<T> {
  items: T[];
  sortKey?: keyof T;
  defaultDirection?: SortDirection;
  children: (sorted: T[]) => ReactNode;
}

export function useSort<T>(
  items: T[],
  defaultKey?: keyof T,
  defaultDir: SortDirection = "asc",
): {
  sorted: T[];
  requestSort: (key: keyof T) => void;
  sortConfig: { key: keyof T | null; direction: SortDirection };
} {
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultKey ?? null);
  const [sortDir, setSortDir] = useState<SortDirection>(defaultDir);

  const sorted = useMemo(() => {
    if (!sortKey) return items;
    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [items, sortKey, sortDir]);

  const requestSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return { sorted, requestSort, sortConfig: { key: sortKey, direction: sortDir } };
}
