/**
 * Trial Management
 * Handles trial periods, expiration, and conversion.
 */

export interface TrialState {
  tenantId: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "converted";
  daysRemaining: number;
}

export class TrialManagement {
  startTrial(tenantId: string, days = 14): TrialState {
    const start = new Date();
    const end = new Date(start.getTime() + days * 86400000);
    return {
      tenantId,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: "active",
      daysRemaining: days,
    };
  }

  checkExpiration(state: TrialState): "active" | "expired" {
    return new Date(state.endDate) > new Date() ? "active" : "expired";
  }
}

export const trialManagement = new TrialManagement();
