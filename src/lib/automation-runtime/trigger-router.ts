import { listAutomations } from "./automation-registry";
import { runWorkflow } from "./workflow-runtime";

export interface TriggerEvent {
  type: string;
  tenantId: string;
  payload: Record<string, unknown>;
}

const bindings = new Map<string, string[]>(); // triggerType -> workflowIds

export function bindTrigger(triggerType: string, workflowId: string) {
  const arr = bindings.get(triggerType) ?? [];
  if (!arr.includes(workflowId)) arr.push(workflowId);
  bindings.set(triggerType, arr);
}

export async function routeTrigger(event: TriggerEvent) {
  const ids = bindings.get(event.type) ?? [];
  const workflows = listAutomations(event.tenantId).filter((w) => ids.includes(w.id));
  return Promise.all(workflows.map((wf) => runWorkflow(wf, event.payload)));
}
