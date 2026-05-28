import type { PipelineTemplate } from "../core/crm-constants";
import type { Pipeline } from "../core/crm-entities";

export class PipelineTemplates {
  getTemplates(): PipelineTemplate[] {
    return [
      {
        name: "Sales Pipeline",
        description: "Default sales pipeline for new tenants",
        stages: [
          { name: "Prospecting", probability: 10, position: 0 },
          { name: "Qualification", probability: 25, position: 1 },
          { name: "Proposal", probability: 50, position: 2 },
          { name: "Negotiation", probability: 75, position: 3 },
          { name: "Closed Won", probability: 100, position: 4, color: "green" },
          { name: "Closed Lost", probability: 0, position: 5, color: "red" },
        ],
      },
      {
        name: "Enterprise Sales",
        description: "Complex enterprise sales cycle",
        stages: [
          { name: "Prospecting", probability: 5, position: 0 },
          { name: "Needs Analysis", probability: 15, position: 1 },
          { name: "Solution Design", probability: 30, position: 2 },
          { name: "Proof of Value", probability: 50, position: 3 },
          { name: "Business Case", probability: 70, position: 4 },
          { name: "Negotiation", probability: 85, position: 5 },
          { name: "Closed Won", probability: 100, position: 6, color: "green" },
        ],
      },
    ];
  }

  applyTemplate(template: PipelineTemplate, tenantId: string): Omit<Pipeline, "id" | "createdAt"> {
    return {
      tenantId,
      name: template.name,
      description: template.description,
      isActive: true,
      stages: template.stages.map((s, i) => ({
        ...s,
        id: `stage_${i}`,
        pipelineId: "temp",
      })),
    };
  }
}

export const pipelineTemplates = new PipelineTemplates();