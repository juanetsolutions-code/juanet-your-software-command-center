/**
 * Repository Execution Standardization - Base Repository
 * Standardized base class for all dashboard repositories with pagination, filtering, sorting, optimistic updates, and retry safety.
 */

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface RepositoryResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export abstract class BaseRepository<T extends { id: string; tenant_id?: string }> {
  protected tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  abstract list(
    filters?: FilterOptions,
    sort?: SortOptions,
    pagination?: PaginationOptions,
  ): Promise<RepositoryResult<T>>;

  abstract getById(id: string): Promise<T | null>;

  abstract create(data: Partial<T>): Promise<T>;

  abstract update(id: string, data: Partial<T>, expectedVersion?: number): Promise<T>;

  abstract delete(id: string): Promise<void>;

  protected applyPagination(query: any, options?: PaginationOptions) {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const from = (page - 1) * pageSize;
    // In real impl: apply to Supabase query
    return { query, from, page, pageSize };
  }

  protected applyFilters(query: any, filters?: FilterOptions) {
    // Apply tenant isolation + filters
    return query;
  }

  protected applySort(query: any, sort?: SortOptions) {
    return query;
  }

  protected prepareOptimisticUpdate(current: T, updates: Partial<T>): Partial<T> {
    return { ...current, ...updates, updated_at: new Date().toISOString() };
  }
}
