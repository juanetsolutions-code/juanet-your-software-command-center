/**
 * Organizational Memory
 * Stores and retrieves cross-system organizational knowledge
 * and historical context for tenants and platform.
 */

export interface OrgMemoryEntry {
  id: string;
  tenantId: string;
  category: "process" | "incident" | "decision" | "preference" | "relationship";
  content: string;
  embedding?: number[]; // placeholder for future vector
  importance: number;
  lastAccessed: string;
  metadata: Record<string, any>;
}

export class OrganizationalMemory {
  private store: OrgMemoryEntry[] = [];

  storeMemory(entry: Omit<OrgMemoryEntry, "id" | "lastAccessed">): OrgMemoryEntry {
    const mem: OrgMemoryEntry = {
      ...entry,
      id: `mem-${Date.now()}`,
      lastAccessed: new Date().toISOString(),
    };
    this.store.push(mem);
    return mem;
  }

  retrieveRelevant(tenantId: string, query: string, limit = 5): OrgMemoryEntry[] {
    return this.store
      .filter((e) => e.tenantId === tenantId)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }
}

export const organizationalMemory = new OrganizationalMemory();
