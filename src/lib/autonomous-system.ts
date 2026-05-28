import { autonomousOrchestrator } from "./autonomous-core/autonomous-orchestrator";
import { salesAgent } from "./crm/agent/sales-agent-orchestrator";
import { agentRegistry } from "./agent-swarm/agent-registry";
import { leadHunterAgent } from "./agents/sales/lead-hunter-agent";
import { leadQualifierAgent } from "./agents/sales/lead-qualifier-agent";
import { followupAgent } from "./agents/sales/followup-agent";
import { conversionAgent } from "./agents/sales/conversion-agent";

export type AutonomousSystemStatus = {
  initialized: boolean;
  activeTenants: number;
  registeredAgents: string[];
  agentCount: number;
  cycleCount: number;
};

export class AutonomousBusinessSystem {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    autonomousOrchestrator.initialize();
    
    agentRegistry.register(leadHunterAgent);
    agentRegistry.register(leadQualifierAgent);
    agentRegistry.register(followupAgent);
    agentRegistry.register(conversionAgent);

    this.initialized = true;
  }

  async initializeTenant(tenantId: string, autonomyLevel: "off" | "assist" | "semi_auto" | "auto" = "assist"): Promise<void> {
    salesAgent.setAutonomyLevel(tenantId, autonomyLevel);
  }

  async runTenantCycle(tenantId: string): Promise<{
    signals: number;
    actions: number;
    dealsProgressed: number;
    insights: number;
  }> {
    const result = await autonomousOrchestrator.runTenantCycle(tenantId);
    
    return {
      signals: result?.signals ?? 0,
      actions: result?.actionsTriggered ?? 0,
      dealsProgressed: result?.dealsProcessed ?? 0,
      insights: 0,
    };
  }

  status(): AutonomousSystemStatus {
    const orchestratorStatus = autonomousOrchestrator.getStatus();
    return {
      initialized: this.initialized,
      activeTenants: 0,
      registeredAgents: orchestratorStatus.activeAgents ? ["lead-hunter", "lead-qualifier", "followup", "conversion"] : [],
      agentCount: orchestratorStatus.activeAgents,
      cycleCount: orchestratorStatus.cycleCount,
    };
  }
}

export const autonomousSystem = new AutonomousBusinessSystem();