/**
 * Trigger System - Handles different trigger types for automations.
 */

import type { TriggerType } from "./automation-types";

type TriggerHandler = (config: Record<string, any>) => Promise<boolean>;

const triggerHandlers = new Map<TriggerType, TriggerHandler>();

export function registerTrigger(type: TriggerType, handler: TriggerHandler) {
  triggerHandlers.set(type, handler);
}

export async function evaluateTrigger(type: TriggerType, config: Record<string, any>) {
  const handler = triggerHandlers.get(type);
  if (!handler) return false;
  return handler(config);
}

// Example handlers
registerTrigger("event", async (config) => {
  // Would check against incoming events
  return true;
});

registerTrigger("schedule", async (config) => {
  // Would integrate with job scheduler
  return false; // placeholder
});
