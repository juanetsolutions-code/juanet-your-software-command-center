type SearchableModule = "projects" | "invoices" | "messages" | "tenants" | "users" | "integrations";

export interface SearchResult {
  id: string;
  module: SearchableModule;
  title: string;
  description?: string;
  url: string;
  relevance: number;
}

export interface SearchQuery {
  query: string;
  modules?: SearchableModule[];
  tenantId?: string;
}

const searchIndex: Map<string, SearchResult[]> = new Map();

export function buildSearchIndex(results: SearchResult[], module: SearchableModule) {
  searchIndex.set(module, results);
}

export function search(query: SearchQuery): SearchResult[] {
  const { query: searchTerm, modules, tenantId } = query;
  const allResults: SearchResult[] = [];

  const targetModules = modules ?? (Array.from(searchIndex.keys()) as SearchableModule[]);

  targetModules.forEach((module) => {
    const moduleResults = searchIndex.get(module) ?? [];
    const filtered = moduleResults.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description?.toLowerCase().includes(searchTerm.toLowerCase) ?? false),
    );
    allResults.push(
      ...filtered.map((r) => ({ ...r, relevance: calculateRelevance(r, searchTerm) })),
    );
  });

  return allResults.sort((a, b) => b.relevance - a.relevance).slice(0, 50);
}

function calculateRelevance(result: SearchResult, query: string): number {
  const titleMatch = result.title.toLowerCase().includes(query.toLowerCase()) ? 10 : 0;
  const descMatch =
    (result.description?.toLowerCase().includes(query.toLowerCase) ?? false) ? 5 : 0;
  return titleMatch + descMatch + (result.module === "projects" ? 2 : 0);
}
