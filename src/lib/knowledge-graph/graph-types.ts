/**
 * Operational Knowledge Graph Foundations - Graph Types
 * Core types for the operational knowledge graph.
 */

export interface Entity {
  id: string;
  type: string;
  tenantId: string;
  attributes: Record<string, any>;
}

export interface Relationship {
  from: string;
  to: string;
  type: string;
  weight: number;
  tenantId: string;
}

export interface GraphQueryOptions {
  tenantId?: string;
  maxDepth?: number;
  relationshipTypes?: string[];
}
