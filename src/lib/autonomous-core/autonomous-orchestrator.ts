import type { DomainEvent } from "@/lib/event-bus/event-bus";
import { registerEventHandler, emitEvent } from "@/lib/event-bus";
import { EventFusionEngine } from "./events/event-fusion-engine";
import { CrossSystemEventBus } from "./events/cross-system-event-bus";
import { EventPriorityResolver } from "./events/event-priority-resolver";
import { DecisionArbiter } from "./decisions/decision-arbiter";
import { ConflictResolutionEngine } from "./decisions/conflict-resolution-engine";
import { PriorityScoringMatrix } from "./decisions/priority-scoring-matrix";
import { RevenueLoopEngine } from "./revenue/revenue-loop-engine";
import { GlobalMemoryStore } from "./memory/global-memory-store";
import { systemSafetyController } from "./safety/system-safety-controller";
import { agentRegistry } from "@/lib/agent-swarm/agent-registry";
import { crmAgentJobHandler } from "@/lib/jobs/handlers/crm-agent-handler";

export type AutonomousConfig = {
  enabled: boolean;
  autonomyLevel: "off" | "assist" | "semi_auto" | "auto";
  maxCyclesPerHour: number;
};

export class AutonomousOrchestrator {
  private fusionEngine = new EventFusionEngine();
  private crossBus = new CrossSystemEventBus();
  private priorityResolver = new EventPriorityResolver();
  private arbiter = new DecisionArbiter();
  private conflictResolver = new ConflictResolutionEngine();
  private priorityMatrix = new PriorityScoringMatrix();
  private revenueEngine = new RevenueLoopEngine();
  private memory = new GlobalMemoryStore();

  private cycleCount = 0;
  private lastCycle = 0;

  initialize(): void {
    this.setupEventBridge();
    this.setupHandlers();
  }

  private setupEventBridge(): void {
    registerEventHandler({
      id: "autonomous-event-fusion",
      eventType: "*",
      handler: async (event: DomainEvent) => {
        const systemEvent = this.fusionEngine.fuse(event);
        this.crossBus.bridgeFromMainBus(event);
        this.processEvent(systemEvent);
      },
      priority: 1,
    });
  }

  private setupHandlers(): void {
    registerEventHandler({
      id: "autonomous-revenue-cycle",
      eventType: "crm.cycle.trigger",
      handler: async (event) => {
        const tenantId = event.tenantId;
        if (tenantId) {
          await this.runTenantCycle(tenantId);
        }
      },
      priority: 5,
    });
  }

  private async processEvent(event: DomainEvent): Promise<void> {
    if (!event.tenantId) return;

    const proposal = {
      id: `prop_${Date.now()}`,
      component: this.identifyComponent(event),
      action: event.type,
      priority: this.calculatePriority(event.type),
      tenantId: event.tenantId,
      payload: event.payload,
    } as any;

    this.arbiter.propose(proposal);
  }

  private calculatePriority(type: string): number {
    const priorityMap: Record<string, number> = {
      "deal.closed_won": 100,
      "deal.stalled": 90,
      "lead.hot": 90,
      "signal.high_intent": 85,
      "crm.task.created": 70,
      "automation.triggered": 60,
    };
    return priorityMap[type] ?? 50;
  }

  private identifyComponent(event: DomainEvent): string {
    if (event.type.startsWith("deal.") || event.type.startsWith("lead.")) return "crm";
    if (event.type.startsWith("agent.")) return "agents";
    if (event.type.includes("signal")) return "signals";
    if (event.type.startsWith("automation.")) return "automation";
    if (event.type.includes("billing") || event.type.includes("subscription")) return "billing";
    return "system";
  }

  async runTenantCycle(tenantId: string): Promise<any> {
    const now = Date.now();
    const hourMs = 3600000;

    if (now - this.lastCycle < hourMs / this.getAutonomousConfig(tenantId).maxCyclesPerHour) {
      return;
    }

    this.lastCycle = now;
    this.cycleCount++;

    const result = await this.revenueEngine.runCycle(tenantId);
    this.recordOutcome(tenantId, "revenue_cycle", result);

    return result;
  }

  private recordOutcome(tenantId: string, pattern: string, outcome: Record<string, unknown>): void {
    this.memory.set({
      id: `mem_${Date.now()}`,
      tenantId,
      type: "outcome",
      key: pattern,
      value: outcome,
      timestamp: new Date().toISOString(),
    });
  }

  private getAutonomousConfig(tenantId: string): AutonomousConfig {
    return {
      enabled: true,
      autonomyLevel: "assist",
      maxCyclesPerHour: 10,
    };
  }

  getStatus(): { cycleCount: number; activeAgents: number } {
    return {
      cycleCount: this.cycleCount,
      activeAgents: agentRegistry.list().length,
    };
  }
}

export const autonomousOrchestrator = new AutonomousOrchestrator();