/**
 * Core Automation Engine
 * Central orchestrator for all automation in Juanet.
 * Supports event-driven and rule-based triggers.
 * Tenant-aware and safe execution.
 */

import { AutomationContext } from "./context";
import { executeAction } from "./executor";
import { getRegisteredAutomations } from "./registry";
import type { AutomationDefinition } from "./automation-types";

export class AutomationEngine {
  private static instance: AutomationEngine;

  private constructor() {}

  public static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  /**
   * Trigger automations based on an event.
   */
  public async trigger(eventType: string, payload: any, context: AutomationContext): Promise<void> {
    const automations = getRegisteredAutomations();

    for (const automation of automations) {
      if (this.matchesTrigger(automation.trigger, eventType, payload, context)) {
        try {
          await this.executeAutomation(automation, payload, context);
        } catch (error) {
          console.error(`[AutomationEngine] Failed to execute ${automation.id}:`, error);
          // Safety: do not let one failure stop others
        }
      }
    }
  }

  private matchesTrigger(
    trigger: AutomationDefinition["trigger"],
    eventType: string,
    payload: any,
    context: AutomationContext,
  ): boolean {
    if (trigger.type === "event" && trigger.eventType === eventType) {
      // Basic tenant isolation check
      if (trigger.tenantId && trigger.tenantId !== context.tenantId) {
        return false;
      }
      return true;
    }
    // Future: support schedule, rule, etc.
    return false;
  }

  private async executeAutomation(
    automation: AutomationDefinition,
    payload: any,
    context: AutomationContext,
  ): Promise<void> {
    const execContext = { ...context, payload, automationId: automation.id };

    for (const step of automation.steps) {
      await executeAction(step.action, step.config, execContext);
    }
  }

  public registerAutomation(automation: AutomationDefinition): void {
    // Delegates to registry
    const { registerAutomation } = require("./registry");
    registerAutomation(automation);
  }

  /**
   * AI Integration Point (additive only)
   * Allows AI agents to trigger workflows safely via the existing engine.
   */
  public async triggerFromAI(eventType: string, payload: any, tenantId: string): Promise<void> {
    const context = { tenantId, triggeredBy: "ai_agent" };
    await this.trigger(eventType, payload, context as any);
  }
}

export const automationEngine = AutomationEngine.getInstance();
