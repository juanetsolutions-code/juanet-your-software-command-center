/**
 * Cost Forecasting
 * Predicts future spend at tenant and platform level.
 */

export interface CostForecast {
  tenantId: string;
  currentMonthly: number;
  forecast30d: number;
  forecast90d: number;
  variance: number;
  drivers: string[];
}

export class CostForecasting {
  forecast(tenantId: string, current: number, usageTrend: number): CostForecast {
    return {
      tenantId,
      currentMonthly: current,
      forecast30d: Math.round(current * (1 + usageTrend * 0.25)),
      forecast90d: Math.round(current * (1 + usageTrend * 0.75)),
      variance: 0.12,
      drivers: usageTrend > 0.3 ? ["compute_growth", "storage"] : ["stable"],
    };
  }
}

export const costForecasting = new CostForecasting();
