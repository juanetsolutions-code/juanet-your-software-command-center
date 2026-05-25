/**
 * Copilot Actions
 * Defines safe, auditable actions copilots can propose or execute.
 */

export interface CopilotAction {
  id: string;
  type: string;
  tenantId: string;
  parameters: Record<string, any>;
  riskScore: number;
  requiresApproval: boolean;
  reversible: boolean;
}

export class CopilotActions {
  proposeAction(tenantId: string, type: string, params: Record<string, any>): CopilotAction {
    const risk = this.estimateRisk(type);
    return {
      id: `action-${Date.now()}`,
      type,
      tenantId,
      parameters: params,
      riskScore: risk,
      requiresApproval: risk > 0.6,
      reversible: true,
    };
  }

  private estimateRisk(type: string): number {
    if (type.includes("delete") || type.includes("suspend")) return 0.85;
    if (type.includes("scale") || type.includes("modify")) return 0.55;
    return 0.25;
  }
}

export const copilotActions = new CopilotActions();
