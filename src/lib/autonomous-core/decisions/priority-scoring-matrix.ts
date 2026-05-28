export type PriorityMatrix = {
  revenueImpact: number;
  urgency: number;
  tenantRisk: number;
  complianceRisk: number;
};

export class PriorityScoringMatrix {
  score(matrix: PriorityMatrix): number {
    let score = 0;

    score += (matrix.revenueImpact * 0.4);
    score += (matrix.urgency * 0.3);
    score -= (matrix.tenantRisk * 0.2);
    score -= (matrix.complianceRisk * 0.1);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  evaluateAction(action: string, context: { tenantId: string; revenue: number }): PriorityMatrix {
    const matrix: PriorityMatrix = {
      revenueImpact: this.getRevenueImpact(action, context.revenue),
      urgency: this.getUrgency(action),
      tenantRisk: 0,
      complianceRisk: 0,
    };

    return matrix;
  }

  private getRevenueImpact(action: string, revenue: number): number {
    if (action.includes("close_deal") || action.includes("upsell")) {
      return Math.min(100, revenue / 1000);
    }
    if (action.includes("new_lead")) return 70;
    if (action.includes("follow_up")) return 50;
    return 30;
  }

  private getUrgency(action: string): number {
    if (action.includes("urgent") || action.includes("churn") || action.includes("stalled")) {
      return 90;
    }
    if (action.includes("hot")) return 70;
    return 50;
  }
}