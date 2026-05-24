/**
 * Action Executor
 * Responsible for safely executing individual automation actions.
 * Uses adapters for different action types (notification, billing, etc.).
 */

import type { AutomationContext } from './context';

export async function executeAction(
  actionType: string,
  config: Record<string, any>,
  context: AutomationContext
): Promise<any> {
  switch (actionType) {
    case 'send_notification':
      return executeSendNotification(config, context);
    case 'create_invoice':
      return executeCreateInvoice(config, context);
    case 'update_record':
      return executeUpdateRecord(config, context);
    // Extend with more action types as needed
    default:
      console.warn(`[Automation] Unknown action type: ${actionType}`);
      return { success: false, reason: 'unknown_action' };
  }
}

async function executeSendNotification(config: any, context: AutomationContext) {
  // Adapter to existing notification system (backend only)
  const { sendInternalNotification } = require('@/lib/services/notification-service');
  return sendInternalNotification({
    tenantId: context.tenantId,
    type: config.type,
    payload: { ...config, triggeredBy: context.userId },
  });
}

async function executeCreateInvoice(config: any, context: AutomationContext) {
  // Placeholder adapter to billing module
  console.log('[Automation] Would create invoice for tenant', context.tenantId);
  return { success: true, invoiceId: 'INV-AUTO-' + Date.now() };
}

async function executeUpdateRecord(config: any, context: AutomationContext) {
  // Safe adapter – in real impl would call repository with proper permissions
  console.log('[Automation] Update record action executed', config);
  return { success: true };
}
