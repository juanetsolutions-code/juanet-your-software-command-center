/**
 * Trigger Bindings - Connects modules to automation.
 */

import { bindTrigger } from './trigger-registry';

export function setupDefaultBindings() {
  bindTrigger('payment.success', 'auto-create-invoice');
  bindTrigger('invoice.created', 'auto-send-receipt');
  bindTrigger('request.submitted', 'auto-notify-team');
}
