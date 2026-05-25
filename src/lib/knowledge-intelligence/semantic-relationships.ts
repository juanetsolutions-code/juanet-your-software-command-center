/**
 * Semantic Relationships
 * Models rich semantic connections between entities across the enterprise.
 */

import type { KnowledgeNode, KnowledgeEdge } from "./knowledge-graph";

export interface SemanticRelation {
  type: string;
  strength: number;
  bidirectional: boolean;
  context: string[];
}

export class SemanticRelationships {
  inferRelationships(nodes: KnowledgeNode[]): KnowledgeEdge[] {
    const edges: KnowledgeEdge[] = [];

    // Very simple heuristic inference for demo
    const tenantNodes = nodes.filter((n) => n.type === "tenant");
    const decisionNodes = nodes.filter((n) => n.type === "decision");

    for (const t of tenantNodes) {
      for (const d of decisionNodes) {
        if (d.tenantId === t.tenantId) {
          edges.push({
            id: `sem-${t.id}-${d.id}`,
            from: t.id,
            to: d.id,
            relation: "made_decision",
            weight: 0.9,
          });
        }
      }
    }

    return edges;
  }
}

export const semanticRelationships = new SemanticRelationships();
