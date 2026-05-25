/**
 * Context Engine
 * Builds rich, AI-consumable contextual representations from the knowledge base.
 */

import type { KnowledgeNode } from "./knowledge-graph";

export interface ContextSnapshot {
  tenantId: string;
  primaryEntities: KnowledgeNode[];
  relationshipsSummary: string;
  keySignals: Record<string, any>;
  generatedAt: string;
  tokenEstimate: number;
}

export class ContextEngine {
  buildContext(tenantId: string, nodes: KnowledgeNode[]): ContextSnapshot {
    const relevant = nodes.filter((n) => !n.tenantId || n.tenantId === tenantId);
    const summary = `${relevant.length} entities across ${new Set(relevant.map((n) => n.type)).size} types`;

    return {
      tenantId,
      primaryEntities: relevant.slice(0, 12),
      relationshipsSummary: summary,
      keySignals: {
        entityCount: relevant.length,
        hasIncidents: relevant.some((n) => n.type === "incident"),
      },
      generatedAt: new Date().toISOString(),
      tokenEstimate: Math.floor(relevant.length * 28 + 180),
    };
  }
}

export const contextEngine = new ContextEngine();
