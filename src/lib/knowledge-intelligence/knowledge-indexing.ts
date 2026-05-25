/**
 * Knowledge Indexing
 * Prepares efficient indexing structures for the knowledge graph and memory.
 */

import type { KnowledgeNode } from "./knowledge-graph";

export interface IndexEntry {
  nodeId: string;
  terms: string[];
  type: string;
  tenantId?: string;
}

export class KnowledgeIndexing {
  private index: IndexEntry[] = [];

  indexNode(node: KnowledgeNode): void {
    const terms = [
      node.label.toLowerCase(),
      ...Object.values(node.properties).map((v) => String(v).toLowerCase()),
      node.type,
    ].filter(Boolean);

    this.index.push({
      nodeId: node.id,
      terms: Array.from(new Set(terms)),
      type: node.type,
      tenantId: node.tenantId,
    });
  }

  search(query: string, tenantId?: string): string[] {
    const q = query.toLowerCase();
    return this.index
      .filter((e) => (!tenantId || e.tenantId === tenantId) && e.terms.some((t) => t.includes(q)))
      .map((e) => e.nodeId);
  }
}

export const knowledgeIndexing = new KnowledgeIndexing();
