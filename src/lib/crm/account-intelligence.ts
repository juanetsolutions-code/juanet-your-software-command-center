import type { Account } from "./core/crm-entities";

export type AccountHealth = {
  accountId: string;
  score: number;
  status: "healthy" | "at_risk" | "low_engagement" | "inactive";
  metrics: {
    loginFrequency: number;
    featureUsage: number;
    supportTickets: number;
  };
};

export class AccountIntelligence {
  analyze(account: Account): AccountHealth {
    const metrics = {
      loginFrequency: 0,
      featureUsage: 0,
      supportTickets: 0,
    };

    let score = 50;
    let status: AccountHealth["status"] = "healthy";

    const mockLogins = 10;
    const mockFeatures = 5;
    
    if (mockLogins > 20 && mockFeatures > 10) {
      status = "healthy";
      score = 85;
    } else if (mockLogins > 5) {
      status = "at_risk";
      score = 60;
    } else {
      status = "low_engagement";
      score = 30;
    }

    return {
      accountId: account.id,
      score,
      status,
      metrics,
    };
  }
}