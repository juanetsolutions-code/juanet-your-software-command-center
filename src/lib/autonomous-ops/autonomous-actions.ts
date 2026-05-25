/**
 * Autonomous Actions (Preparation Layer)
 * Defines the shape of safe, auditable, non-destructive autonomous actions.
 * Actual execution is governed elsewhere (no auto-execution here).
 */

import type { RemediationPlan } from "./remediation-planner";

export type AutonomousActionType =
  | "scale_preview"
  | "cache_warm"
  | "log_investigation"
  | "notify_human"
  | "prepare_rollback"
  | "synthetic_test"
  | "resource_recommendation";

export interface AutonomousAction {
  id: string;
  type: AutonomousActionType;
  tenantId: string;
  description: string;
  parameters: Record<string, any>;
  riskReductionEstimate: number;
  reversible: boolean;
  requiresApproval: boolean;
  simulatedOutcome?: string;
}

export class AutonomousActions {
  prepareActionsFromPlan(plan: RemediationPlan): AutonomousAction[] {
    const actions: AutonomousAction[] = [];

    plan.flows.forEach((flow, idx) => {
      flow.steps.forEach((step) => {
        actions.push({
          id: `action-${plan.id}-${idx}-${step.action}`,
          type: this.mapToActionType(step.action),
          tenantId: plan.tenantId,
          description: `Prepare: ${step.action}`,
          parameters: { step: step.action, planId: plan.id },
          riskReductionEstimate: flow.riskReduction / flow.steps.length,
          reversible: step.reversible,
          requiresApproval: plan.requiredHumanApproval || step.requiredApproval || false,
        });
      });
    });

    return actions;
  }

  private mapToActionType(step: string): AutonomousActionType {
    if (step.includes("scale")) return "scale_preview";
    if (step.includes("cache")) return "cache_warm";
    if (step.includes("rollback")) return "prepare_rollback";
    if (step.includes("notify")) return "notify_human";
    return "resource_recommendation";
  }
}

export const autonomousActions = new AutonomousActions();
