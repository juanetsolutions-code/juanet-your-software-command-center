import { emitEvent } from "@/lib/event-bus";

export type SwarmMetrics = {
  cycleCount: number;
  tasksProcessed: number;
  agentsActive: number;
  uptime: number;
  tenantLoads: Record<string, number>;
};

export class SwarmStateManager {
  private metrics: SwarmMetrics = {
    cycleCount: 0,
    tasksProcessed: 0,
    agentsActive: 0,
    uptime: 0,
    tenantLoads: {},
  };
  private startTime = Date.now();

  updateMetrics(updates: Partial<SwarmMetrics>): void {
    this.metrics = { ...this.metrics, ...updates };
  }

  incrementCycle(): void {
    this.metrics.cycleCount++;
  }

  recordTask(tenantId: string): void {
    this.metrics.tasksProcessed++;
    this.metrics.tenantLoads[tenantId] = (this.metrics.tenantLoads[tenantId] ?? 0) + 1;
  }

  getMetrics(): SwarmMetrics {
    return {
      ...this.metrics,
      uptime: Date.now() - this.startTime,
    };
  }

  reset(): void {
    this.metrics = {
      cycleCount: 0,
      tasksProcessed: 0,
      agentsActive: 0,
      uptime: 0,
      tenantLoads: {},
    };
    this.startTime = Date.now();
  }

  snapshot(): SwarmMetrics {
    return this.getMetrics();
  }

  emitState(): void {
    emitEvent({
      id: `evt_${Date.now()}`,
      type: "swarm.state_update",
      timestamp: new Date().toISOString(),
      payload: this.getMetrics(),
      version: "1.0",
    });
  }
}

export const swarmState = new SwarmStateManager();