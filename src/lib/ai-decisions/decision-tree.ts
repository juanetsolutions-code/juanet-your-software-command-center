/**
 * Decision Tree and Types for AI decisions.
 */

export interface Decision {
  action: string;
  confidence: number;
  reasoningTrace: string[];
  metadata?: Record<string, any>;
}

export interface DecisionInput {
  tenantId: string;
  signals?: Record<string, any>;
  contextKeys?: string[];
  previousDecisions?: Decision[];
}

export interface DecisionTreeNode {
  condition: string;
  trueAction: string;
  falseAction: string;
  confidenceBoost?: number;
}
