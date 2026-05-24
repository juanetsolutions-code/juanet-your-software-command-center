import { getAllForTenant, type IndexDocument } from "./indexing-engine";
import { rankResults } from "./search-ranking";

export interface TenantSearchQuery {
  tenantId: string;
  q: string;
  types?: string[];
  limit?: number;
}

export interface TenantSearchHit {
  doc: IndexDocument;
  score: number;
}

export function searchTenant(query: TenantSearchQuery): TenantSearchHit[] {
  const docs = getAllForTenant(query.tenantId).filter(
    (d) => !query.types || query.types.includes(d.type),
  );
  const ranked = rankResults(query.q, docs);
  return ranked.slice(0, query.limit ?? 25);
}
