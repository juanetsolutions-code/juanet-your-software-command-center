/**
 * AI Action Safety Layer - Action Validator
 * Validates AI-proposed actions against safety rules and tenant policies.
 */

export class ActionValidator {
  validate(action: any, tenantId: string): { valid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    if (action.riskLevel === "high" && !action.approvedByHuman) {
      reasons.push("High-risk action requires human approval");
    }
    return { valid: reasons.length === 0, reasons };
  }
}

export const actionValidator = new ActionValidator();
