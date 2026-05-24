/**
 * Automation Registry
 * Stores and manages all registered automation definitions.
 * Supports tenant-specific and global automations.
 */

import type { AutomationDefinition } from './automation-types';

const automations: AutomationDefinition[] = [];

export function registerAutomation(automation: AutomationDefinition): void {
  // Prevent duplicates
  const exists = automations.some(a => a.id === automation.id);
  if (!exists) {
    automations.push(automation);
  }
}

export function getRegisteredAutomations(tenantId?: string): AutomationDefinition[] {
  if (tenantId) {
    return automations.filter(a => !a.tenantId || a.tenantId === tenantId);
  }
  return [...automations];
}

export function getAutomationById(id: string): AutomationDefinition | undefined {
  return automations.find(a => a.id === id);
}
