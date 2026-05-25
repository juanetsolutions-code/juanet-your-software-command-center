/**
 * Predictive Intelligence Infrastructure - Prediction History
 * Stores and retrieves historical predictions for model improvement.
 */

export interface PredictionRecord {
  id: string;
  type: string;
  input: any;
  prediction: any;
  actualOutcome?: any;
  tenantId: string;
  timestamp: string;
}

export class PredictionHistory {
  private records: PredictionRecord[] = [];

  record(record: Omit<PredictionRecord, "id" | "timestamp">): PredictionRecord {
    const full: PredictionRecord = {
      ...record,
      id: `pred_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.records.push(full);
    return full;
  }

  getForTenant(tenantId: string): PredictionRecord[] {
    return this.records.filter((r) => r.tenantId === tenantId);
  }
}

export const predictionHistory = new PredictionHistory();
