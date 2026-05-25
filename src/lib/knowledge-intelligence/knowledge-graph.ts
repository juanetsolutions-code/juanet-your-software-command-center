/**
 * Enterprise Knowledge Intelligence - Knowledge Graph
 * Prepares the foundation for enterprise knowledge graph,
 * semantic relationships, and AI-ready context modeling.
 */

export interface KnowledgeNode {
  id: string;
  type: "tenant" | "service" | "decision" | "incident" | "user" | "policy" | "artifact";
  tenantId?: string;
  label: string;
  properties: Record<string, any>;
  createdAt: string;
}

export interface KnowledgeEdge {
  id: string;
  from: string;
  to: string;
  relation: string;
  weight: number;
  metadata?: Record<string, any>;
}

export class KnowledgeGraph {
  private nodes = new Map<string, KnowledgeNode>();
  private edges: KnowledgeEdge[] = [];

  addNode(node: Omit<KnowledgeNode, "createdAt">): KnowledgeNode {
    const full: KnowledgeNode = { ...node, createdAt: new Date().toISOString() };
    this.nodes.set(full.id, full);
    return full;
  }

  addEdge(edge: Omit<KnowledgeEdge, "id">): KnowledgeEdge {
    const full: KnowledgeEdge = { ...edge, id: `edge-${Date.now()}-${edge.from}-${edge.to}` };
    this.edges.push(full);
    return full;
  }

  getRelated(nodeId: string, maxDepth = 2): { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] } {
    // Simple breadth-first traversal stub
    const visited = new Set<string>();
    const resultNodes: KnowledgeNode[] = [];
    const resultEdges: KnowledgeEdge[] = [];

    const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }];
    visited.add(nodeId);

    while (queue.length) {
      const { id, depth } = queue.shift()!;
      const node = this.nodes.get(id);
      if (node) resultNodes.push(node);

      if (depth >= maxDepth) continue;

      const connected = this.edges.filter((e) => e.from === id || e.to === id);
      for (const e of connected) {
        resultEdges.push(e);
        const other = e.from === id ? e.to : e.from;
        if (!visited.has(other)) {
          visited.add(other);
          queue.push({ id: other, depth: depth + 1 });
        }
      }
    }

    return { nodes: resultNodes, edges: resultEdges };
  }
}

export const knowledgeGraph = new KnowledgeGraph();
