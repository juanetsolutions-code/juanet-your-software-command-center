/**
 * Automation Persistence Layer (Supabase-ready + mock)
 */

import type { AutomationDefinition } from '@/lib/automation/automation-types';

let store: AutomationDefinition[] = [];

export async function saveAutomation(automation: AutomationDefinition): Promise<void> {
  const idx = store.findIndex(a => a.id === automation.id);
  if (idx >= 0) store[idx] = automation;
  else store.push(automation);
}

export async function getAutomations(tenantId?: string): Promise<AutomationDefinition[]> {
  if (tenantId) return store.filter(a => !a.tenantId || a.tenantId === tenantId);
  return [...store];
}
