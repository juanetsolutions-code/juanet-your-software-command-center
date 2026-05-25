/**
 * Operational Knowledge Graph Foundations - Graph Query
 * Query interface for the operational knowledge graph.
 */

import type { Entity } from "./entity-graph";
import { entityGraph } from "./entity-graph";
import { relationshipMapper } from "./relationship-mapper";

export class GraphQuery {
  findRelatedEntities(entityId: string, maxDepth = 2): Entity[] {
    const visited = new Set<string>();
    const results: Entity[] = [];

    const traverse = (id: string, depth: number) => {
      if (depth > maxDepth || visited.has(id)) return;
      visited.add(id);

      const entity = entityGraph.get(id);
      if (entity) results.push(entity);

      const connected = relationshipMapper.getRelationshipsForEntity(id);
      connected.forEach((rel) => {
        const nextId = rel.from === id ? rel.to : rel.from;
        traverse(nextId, depth + 1);
      });
    };

    traverse(entityId, 0);
    return results;
  }
}

export const graphQuery = new GraphQuery();
