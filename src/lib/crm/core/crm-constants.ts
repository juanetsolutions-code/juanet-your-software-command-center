import type { DealStage, LeadStatus, DealPriority } from "./crm-types";

export const DEFAULT_LEAD_SCORE = 50;

export const LEAD_SCORE_THRESHOLDS = {
  HOT: 80,
  WARM: 50,
  COLD: 20,
} as const;

export const DEFAULT_DEAL_PROBABILITY_BY_STAGE: Record<DealStage, number> = {
  prospecting: 10,
  qualification: 25,
  proposal: 50,
  negotiation: 75,
  closed_won: 100,
  closed_lost: 0,
};

export const DEAL_PRIORITY_WEIGHTS: Record<DealPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 5,
};

export const DEFAULT_PIPELINE: PipelineTemplate = {
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
};

export const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  DEFAULT_PIPELINE,
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
      { name: "Closed Lost", probability: 0, position: 7, color: "red" },
    ],
  },
];

export type PipelineTemplate = {
  name: string;
  description?: string;
  stages: Array<{
    name: string;
    probability: number;
    position: number;
    color?: string;
  }>;
};

export const CRM_COLUMNS = {
  leads: ["id", "tenantId", "firstName", "lastName", "email", "source", "status", "score", "createdAt", "updatedAt"],
  contacts: ["id", "tenantId", "firstName", "lastName", "email", "type", "createdAt", "updatedAt"],
  accounts: ["id", "tenantId", "name", "type", "industry", "website", "createdAt", "updatedAt"],
  deals: ["id", "tenantId", "name", "value", "stage", "probability", "priority", "pipelineId", "createdAt", "updatedAt"],
} as const;