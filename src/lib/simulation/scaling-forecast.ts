/**
 * Scaling Forecast
 * Predicts required infrastructure scaling based on trends and simulations.
 */

export interface ScalingForecast {
  tenantId: string;
  currentCapacity: number;
  predictedNeedIn30d: number;
  predictedNeedIn90d: number;
  recommendedActions: string[];
  confidence: number;
}

export class ScalingForecaster {
  forecast(tenantId: string, current: number, growthRate: number): ScalingForecast {
    return {
      tenantId,
      currentCapacity: current,
      predictedNeedIn30d: Math.ceil(current * (1 + growthRate * 0.3)),
      predictedNeedIn90d: Math.ceil(current * (1 + growthRate * 0.9)),
      recommendedActions:
        growthRate > 0.4 ? ["plan_horizontal_scale", "reserve_capacity"] : ["monitor"],
      confidence: 0.76,
    };
  }
}

export const scalingForecast = new ScalingForecaster();
