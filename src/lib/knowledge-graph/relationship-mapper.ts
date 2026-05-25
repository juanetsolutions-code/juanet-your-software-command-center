/**
 * Operational Knowledge Graph Foundations - Relationship Mapper
 * Maps and maintains relationships between operational entities.
 */

import type { Entity } from "./entity-graph";

export interface Relationship {
  from: string;
  to: string;
  type: string;
  weight: number;
  tenantId: string;
}

export class RelationshipMapper {
  private relationships: Relationship[] = [];

  add(from: Entity, to: Entity, type: string, weight = 1.0): Relationship {
    const rel: Relationship = {
      from: from.id,
      to: to.id,
      type,
      weight,
      tenantId: from.tenantId,
    };
    this.relationships.push(rel);
    return rel;
  }

  getRelationshipsForEntity(entityId: string): Relationship[] {
    return this.relationships.filter((r) => r.from === entityId || r.to === entityId);
  }
}

export const relationshipMapper = new RelationshipMapper();
