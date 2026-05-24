/**
 * Automation Engine - Main entry point for the automation platform.
 * Event-driven and scheduled automation execution.
 */

import type { AutomationWorkflow } from "./automation-types";
import { runWorkflow } from "./workflow-runner";

const workflows = new Map<string, AutomationWorkflow>();

export function registerWorkflow(workflow: AutomationWorkflow) {
  workflows.set(workflow.id, workflow);
}

export async function triggerAutomation(event: string, data: any, tenantId: string) {
  // Find workflows that match this event + tenant
  const matching = Array.from(workflows.values()).filter(
    (w) =>
      w.tenantId === tenantId &&
      w.enabled &&
      w.trigger.type === "event" &&
      w.trigger.config.event === event,
  );

  const results = await Promise.all(matching.map((w) => runWorkflow(w, data)));

  return results;
}

// Future: scheduled execution, AI decision triggers, etc.
export const automationEngine = {
  registerWorkflow,
  triggerAutomation,
};
