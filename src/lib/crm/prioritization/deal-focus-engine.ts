import type { Deal } from "../core/crm-entities";

export class DealFocusEngine {
  getFocusList(deals: Deal[]): Deal[] {
    return deals
      .map(d => ({
        ...d,
        focusScore: this.calculateFocusScore(d),
      }))
      .sort((a, b) => (b.focusScore ?? 0) - (a.focusScore ?? 0))
      .map(d => d);
  }

  private calculateFocusScore(deal: Deal): number {
    let score = deal.probability ?? 50;
    const age = deal.expectedCloseDate ? 
      Math.floor((new Date(deal.expectedCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
    
    if (age < 3) score += 30;
    if (age < 0) score += 50;
    
    score += (deal.value / 10000);
    
    return Math.min(100, score);
  }

  getClosingThisWeek(deals: Deal[]): Deal[] {
    const now = Date.now();
    return deals.filter(d => {
      if (!d.expectedCloseDate) return false;
      const close = new Date(d.expectedCloseDate).getTime();
      const days = Math.floor((close - now) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 7;
    });
  }
}

export const dealFocusEngine = new DealFocusEngine();