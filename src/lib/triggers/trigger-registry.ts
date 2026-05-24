/**
 * Trigger Registry
 */

const bindings = new Map<string, string[]>(); // event -> automation ids

export function bindTrigger(eventType: string, automationId: string) {
  const list = bindings.get(eventType) || [];
  if (!list.includes(automationId)) list.push(automationId);
  bindings.set(eventType, list);
}

export function getBoundAutomations(eventType: string): string[] {
  return bindings.get(eventType) || [];
}
