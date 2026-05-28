import type { Deal } from "../core/crm-entities";

export class InactivityDetector {
  detect(deal: Deal): { daysInactive: number; isStale: boolean; threshold: number } {
    const updated = deal.updatedAt ? new Date(deal.updatedAt).getTime() : 0;
    const days = updated ? Math.floor((Date.now() - updated) / (1000 * 60 * 60 * 24)) : 0;
    const threshold = deal.stage === "closed_won" || deal.stage === "closed_lost" ? 0 : 7;
    return {
      daysInactive: days,
      isStale: days > threshold,
      threshold,
    };
  }

  getStaleDeals(deals: Deal[]): Deal[] {
    return deals.filter((d) => this.detect(d).isStale);
  }
}

export const inactivityDetector = new InactivityDetector();