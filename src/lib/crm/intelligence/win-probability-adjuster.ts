import type { Deal } from "../core/crm-entities";

export class WinProbabilityAdjuster {
  adjust(deal: Deal, factors: {
    engagementScore?: number;
    timeInStage?: number;
    competition?: boolean;
    budgetConfirmed?: boolean;
  }): number {
    let adjusted = deal.probability ?? 50;
    
    if (factors.engagementScore && factors.engagementScore > 70) {
      adjusted += 15;
    } else if (factors.engagementScore && factors.engagementScore < 30) {
      adjusted -= 20;
    }
    
    if (factors.timeInStage && factors.timeInStage > 14) {
      adjusted -= 10;
    }
    
    if (factors.competition) {
      adjusted -= 15;
    }
    
    if (factors.budgetConfirmed) {
      adjusted += 20;
    }
    
    return Math.max(0, Math.min(100, adjusted));
  }
}

export const winProbabilityAdjuster = new WinProbabilityAdjuster();