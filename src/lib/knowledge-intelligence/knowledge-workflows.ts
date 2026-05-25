/**
 * Knowledge Workflows
 * Workflow definitions that operate on and enrich the knowledge graph.
 */

export interface KnowledgeWorkflow {
  id: string;
  tenantId: string;
  steps: string[];
  status: string;
}

export class KnowledgeWorkflows {
  define(tenantId: string, steps: string[]): KnowledgeWorkflow {
    return {
      id: `kwf-${Date.now()}`,
      tenantId,
      steps,
      status: "defined",
    };
  }
}

export const knowledgeWorkflows = new KnowledgeWorkflows();
