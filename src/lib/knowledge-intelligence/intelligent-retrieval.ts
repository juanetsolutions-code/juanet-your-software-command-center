/**
 * Intelligent Retrieval
 * High-level semantic retrieval facade over the knowledge systems.
 */

import type { KnowledgeNode } from "./knowledge-graph";
import { knowledgeGraph } from "./knowledge-graph";
import { organizationalMemory } from "./organizational-memory";
import { contextEngine } from "./context-engine";

export class IntelligentRetrieval {
  async retrieveContextForAI(tenantId: string, focus: string): Promise<any> {
    // Combine graph + memory + context engine
    const graphData = knowledgeGraph.getRelated(`tenant-${tenantId}`, 2);
    const memories = organizationalMemory.retrieveRelevant(tenantId, focus, 4);
    const snapshot = contextEngine.buildContext(tenantId, graphData.nodes);

    return {
      graph: graphData,
      memories,
      contextSnapshot: snapshot,
      retrievalStrategy: "hybrid-graph-memory-v1",
      readyForLLM: true,
    };
  }
}

export const intelligentRetrieval = new IntelligentRetrieval();
