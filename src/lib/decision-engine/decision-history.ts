/**
 * AI Decision Engine - Decision History
 * Persistent, auditable record of all decisions for explainability and learning.
 */

export interface Decision {
  id: string;
  input: DecisionInput;
  recommendedAction: string;
  confidence: number;
  reasoning: string;
  policiesApplied: string[];
  timestamp: string;
  requiresHumanReview: boolean;
  outcome?: "accepted" | "rejected" | "modified";
}

export interface DecisionInput {
  tenantId: string;
  signals: Record<string, any>;
  context: any;
  confidenceThreshold: number;
}

export interface DecisionPolicy {
  id: string;
  name: string;
  rules: string[];
}

export class DecisionHistory {
  private history: Decision[] = [];

  record(decision: Decision): void {
    this.history.push(decision);
  }

  getForTenant(tenantId: string, limit = 50): Decision[] {
    return this.history.filter((d) => d.input.tenantId === tenantId).slice(-limit);
  }
}

export const decisionHistory = new DecisionHistory();
