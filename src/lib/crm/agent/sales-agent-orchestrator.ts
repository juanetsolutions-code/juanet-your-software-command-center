import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";
import type { Signal } from "../signals/signal-engine";
import { actionRouter } from "./actions/action-router";
import { agentDecisionEngine } from "./agent-decision-engine";
import { signalEngine } from "../signals/signal-engine";
import { autonomyLimits } from "./safety/autonomy-limits";
import { salesMemory } from "./memory/sales-memory-store";
import { emitEvent } from "@/lib/event-bus";
import { dealService } from "../services/deal-service";

export type AutonomyLevel = "off" | "assist" | "semi_auto" | "auto";

export type AgentAction = {
  id: string;
  type: "create_task" | "send_reminder" | "update_stage" | "assign_lead" | "generate_note";
  confidence: number;
  priority: "low" | "medium" | "high" | "urgent";
  requiresApproval: boolean;
  payload: Record<string, unknown>;
};

export type ActionDecision = {
  action: AgentAction;
  reason: string;
  approved?: boolean;
};

export type AgentEvaluationResult = {
  tenantId: string;
  decisions: ActionDecision[];
  actionsExecuted: number;
  actionsPendingApproval: string[];
};

export class SalesAgentOrchestrator {
  private autonomyLevels: Map<string, AutonomyLevel> = new Map();

  async evaluate(context: {
    tenantId: string;
    leads?: Lead[];
    deals?: Deal[];
    signals?: Signal[];
  }): Promise<ActionDecision[]> {
    const decisions: ActionDecision[] = [];
    const level = this.autonomyLevels.get(context.tenantId) ?? "off";
    
    if (level === "off") return decisions;
    
    if (context.signals) {
      for (const signal of context.signals) {
        const action = await this.createActionFromSignal(signal);
        if (action) {
          decisions.push({ action, reason: `Signal: ${signal.type}` });
        }
      }
    }
    
    return decisions;
  }

  async runAutonomousCycle(context: {
    tenantId: string;
    userId?: string;
    userRole?: string;
  }): Promise<AgentEvaluationResult> {
    const decisions = await this.evaluate(context);
    const result: AgentEvaluationResult = {
      tenantId: context.tenantId,
      decisions,
      actionsExecuted: 0,
      actionsPendingApproval: [],
    };

    for (const decision of decisions) {
      const { action } = decision;
      
      if (!this.canAct(context.tenantId, action, context.userRole)) {
        continue;
      }

      const routeResult = await actionRouter.route(
        decision,
        { tenantId: context.tenantId, userRole: context.userRole },
        context.userId
      );

      if (routeResult.success) {
        result.actionsExecuted++;
        salesMemory.store({
          id: action.id,
          tenantId: context.tenantId,
          action,
          outcome: "success",
          executedAt: new Date().toISOString(),
          result: routeResult.result,
        });
      } else if (routeResult.pendingApproval) {
        result.actionsPendingApproval.push(action.id);
      }
    }

    if (result.actionsExecuted > 0) {
      emitEvent({
        id: `evt_${Date.now()}`,
        type: "crm.agent.autonomous_cycle",
        tenantId: context.tenantId,
        timestamp: new Date().toISOString(),
        payload: { 
          actionsExecuted: result.actionsExecuted, 
          actionsPendingApproval: result.actionsPendingApproval.length 
        },
        version: "1.0",
      });
    }

    return result;
  }

  async scanAndAct(tenantId: string, userId?: string, userRole?: string): Promise<AgentEvaluationResult> {
    const deals = await dealService.list(tenantId);
    const now = new Date();
    
    const signals: Signal[] = [];
    for (const deal of deals) {
      if (!deal.updatedAt) continue;
      const daysSinceUpdate = Math.floor((now.getTime() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      const signal = signalEngine.detect(deal, daysSinceUpdate);
      if (signal) signals.push(signal);
    }

    return this.runAutonomousCycle({ tenantId, userId, userRole, signals });
  }

  getAutonomyLevel(tenantId: string): AutonomyLevel {
    return this.autonomyLevels.get(tenantId) ?? "off";
  }

  setAutonomyLevel(tenantId: string, level: AutonomyLevel): void {
    this.autonomyLevels.set(tenantId, level);
    emitEvent({
      id: `evt_${Date.now()}`,
      type: "crm.agent.autonomy_level_changed",
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { level },
      version: "1.0",
    });
  }

  private async createActionFromSignal(signal: Signal): Promise<AgentAction | null> {
    if (signal.type === "deal_stuck") {
      return {
        id: `act_${Date.now()}`,
        type: "create_task",
        confidence: 0.9,
        priority: "high",
        requiresApproval: false,
        payload: {
          entityType: "deal",
          entityId: signal.entityId,
          title: "Follow up on stalled deal",
        },
      };
    }
    
    if (signal.type === "high_intent") {
      return {
        id: `act_${Date.now()}`,
        type: "create_task",
        confidence: 0.8,
        priority: "urgent",
        requiresApproval: false,
        payload: {
          entityType: "lead",
          entityId: signal.entityId,
          title: "High-intent lead - immediate outreach",
        },
      };
    }
    
    return null;
  }

  private canAct(tenantId: string, action: AgentAction, userRole?: string): boolean {
    const level = this.autonomyLevels.get(tenantId) ?? "off";
    const limits = autonomyLimits.get(tenantId);
    
    if (!limits.allowedActionTypes.includes(action.type)) {
      return false;
    }

    return agentDecisionEngine.shouldAct(
      { tenantId, entity: null as any, history: [], autonomyLevel: level },
      action
    );
  }
}

export const salesAgent = new SalesAgentOrchestrator();