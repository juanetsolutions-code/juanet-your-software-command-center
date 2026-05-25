/**
 * Platform Simulation & Forecasting - Traffic Simulation
 * Generates synthetic traffic patterns for capacity planning and risk forecasting.
 */

export interface TrafficSimulationResult {
  tenantId: string;
  simulatedRequests: number;
  peakConcurrency: number;
  avgLatency: number;
  errorRate: number;
  duration: string;
  generatedAt: string;
}

export class TrafficSimulation {
  simulate(tenantId: string, baselineRps: number, growthFactor = 1.5): TrafficSimulationResult {
    const peak = Math.floor(baselineRps * growthFactor * 1.8);
    return {
      tenantId,
      simulatedRequests: Math.floor(baselineRps * 3600 * growthFactor),
      peakConcurrency: peak,
      avgLatency: 85 + (growthFactor - 1) * 40,
      errorRate: Math.min(0.04, 0.008 * growthFactor),
      duration: "1h",
      generatedAt: new Date().toISOString(),
    };
  }
}

export const trafficSimulation = new TrafficSimulation();
