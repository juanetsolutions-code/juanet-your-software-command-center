import type { RuntimeWorkflow } from "./workflow-runtime";

const automations = new Map<string, RuntimeWorkflow>();

export function registerAutomation(wf: RuntimeWorkflow) {
  automations.set(wf.id, wf);
}

export function getAutomation(id: string) {
  return automations.get(id);
}

export function listAutomations(tenantId?: string) {
  const all = Array.from(automations.values());
  return tenantId ? all.filter((w) => w.tenantId === tenantId) : all;
}
