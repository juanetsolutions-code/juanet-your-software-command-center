/**
 * Operational Knowledge Graph Foundations - Entity Graph
 * Core graph of operational entities (tenants, workflows, agents, resources).
 */

export interface Entity {
  id: string;
  type: string;
  tenantId: string;
  attributes: Record<string, any>;
}

export class EntityGraph {
  private entities: Map<string, Entity> = new Map();

  add(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  get(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  getByType(type: string, tenantId?: string): Entity[] {
    return Array.from(this.entities.values()).filter(
      (e) => e.type === type && (!tenantId || e.tenantId === tenantId),
    );
  }
}

export const entityGraph = new EntityGraph();
