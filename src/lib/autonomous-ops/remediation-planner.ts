/**
 * Remediation Planner
 * Prepares detailed, auditable, reversible remediation plans.
 * Does not execute destructive changes.
 */

import type { OperationalRisk, RemediationFlow } from "./operational-intelligence";

export interface RemediationPlan {
  id: string;
  tenantId: string;
  risksAddressed: string[];
  flows: RemediationFlow[];
  estimatedTotalRiskReduction: number;
  requiredHumanApproval: boolean;
  auditMetadata: Record<string, any>;
  createdAt: string;
}

export class RemediationPlanner {
  createPlan(risks: OperationalRisk[], flows: RemediationFlow[]): RemediationPlan {
    const totalReduction =
      flows.reduce((sum, f) => sum + f.riskReduction, 0) / Math.max(1, flows.length);
    const highRisk = risks.some((r) => r.score > 0.75);

    return {
      id: `plan-${Date.now()}`,
      tenantId: risks[0]?.tenantId || "unknown",
      risksAddressed: risks.map((r) => r.id),
      flows,
      estimatedTotalRiskReduction: Math.min(0.92, totalReduction),
      requiredHumanApproval: highRisk,
      auditMetadata: {
        riskCount: risks.length,
        highestScore: Math.max(...risks.map((r) => r.score)),
        generatedBy: "remediation-planner-v1",
      },
      createdAt: new Date().toISOString(),
    };
  }
}

export const remediationPlanner = new RemediationPlanner();
