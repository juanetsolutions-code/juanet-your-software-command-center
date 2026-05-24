/**
 * Trigger Manager
 */

import { automationEngine } from '@/lib/automation/engine';
import { createAutomationContext } from '@/lib/automation/context';

export function fireTrigger(eventType: string, payload: any, tenantId: string, userId?: string) {
  const context = createAutomationContext(tenantId, { userId, payload });
  automationEngine.trigger(eventType, payload, context);
}
