/**
 * Action Registry - Registers and executes automation actions.
 */

import type { ActionType } from "./automation-types";

type ActionHandler = (config: Record<string, any>, context: any) => Promise<any>;

const actionHandlers = new Map<ActionType, ActionHandler>();

export function registerAction(type: ActionType, handler: ActionHandler) {
  actionHandlers.set(type, handler);
}

export async function executeAction(
  type: ActionType,
  config: Record<string, any>,
  context: any = {},
) {
  const handler = actionHandlers.get(type);
  if (!handler) {
    throw new Error(`No handler registered for action type: ${type}`);
  }
  return handler(config, context);
}

// Default handlers (can be extended later)
registerAction("send_message", async (config) => {
  console.log("[Automation] Would send message:", config);
  return { sent: true };
});

registerAction("call_ai", async (config, context) => {
  // Placeholder - will integrate with AI assistant later
  return { aiResponse: "AI action placeholder" };
});
