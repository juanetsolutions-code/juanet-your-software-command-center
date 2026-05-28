import type { CrmFilter } from "../core/crm-entities";

export type CrmAggregation = {
  field: string;
  operation: "count" | "sum" | "avg" | "min" | "max";
  groupBy?: string;
};

export type CrmSort = {
  field: string;
  direction: "asc" | "desc";
};

export type CrmQueryOptions = {
  filter?: CrmFilter;
  sort?: CrmSort;
  limit?: number;
  offset?: number;
};

export type CrmQueryResult<T> = {
  data: T[];
  total: number;
  hasMore: boolean;
};

export class CrmQueryEngine {
  async aggregate<T>(items: T[], aggregations: CrmAggregation[]): Promise<Record<string, number>> {
    const results: Record<string, number> = {};

    for (const agg of aggregations) {
      const values = items.map((item) => (item as Record<string, unknown>)[agg.field]).filter((v): v is number => typeof v === "number");
      
      switch (agg.operation) {
        case "count":
          results[`${agg.field}_count`] = values.length;
          break;
        case "sum":
          results[`${agg.field}_sum`] = values.reduce((sum, v) => sum + v, 0);
          break;
        case "avg":
          results[`${agg.field}_avg`] = values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
          break;
        case "min":
          results[`${agg.field}_min`] = Math.min(...values);
          break;
        case "max":
          results[`${agg.field}_max`] = Math.max(...values);
          break;
      }
    }

    return results;
  }

  async paginate<T>(items: T[], options: CrmQueryOptions): Promise<CrmQueryResult<T>> {
    let results = [...items];
    
    if (options.sort) {
      results = results.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[options.sort!.field];
        const bVal = (b as Record<string, unknown>)[options.sort!.field];
        
        if (aVal < bVal) return options.sort!.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return options.sort!.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    const total = results.length;
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    
    results = results.slice(offset, offset + limit);

    return {
      data: results,
      total,
      hasMore: offset + limit < total,
    };
  }
}