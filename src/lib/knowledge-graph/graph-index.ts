/**
 * Operational Knowledge Graph Foundations - Graph Index
 * Indexing layer for fast graph traversal and queries.
 */

export class GraphIndex {
  private index: Map<string, Set<string>> = new Map();

  indexRelationship(from: string, to: string): void {
    if (!this.index.has(from)) this.index.set(from, new Set());
    this.index.get(from)!.add(to);
  }

  getConnected(entityId: string): string[] {
    return Array.from(this.index.get(entityId) || []);
  }
}

export const graphIndex = new GraphIndex();
