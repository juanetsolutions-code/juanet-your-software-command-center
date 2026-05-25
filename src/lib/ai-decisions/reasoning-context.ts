/**
 * Reasoning Context Builder
 * Prepares clean, structured context for the decision engine and agents.
 */

import type { DecisionInput } from "./decision-tree";

export function buildReasoningContext(rawContext: any): DecisionInput {
  return {
    tenantId: rawContext.tenantId,
    signals: {
      paymentOverdue: rawContext.billing?.overdue || false,
      highSupportVolume: (rawContext.support?.openTickets || 0) > 10,
      lowAdoption: (rawContext.adoption?.score || 100) < 40,
    },
    contextKeys: Object.keys(rawContext),
    previousDecisions: rawContext.previousDecisions || [],
  };
}
