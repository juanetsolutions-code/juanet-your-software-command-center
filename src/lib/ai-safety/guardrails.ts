/**
 * AI Guardrails - Prevent unsafe actions.
 */

export function applyGuardrails(action: string, context: any): boolean {
  const forbidden = ['delete_all_data', 'modify_auth', 'bypass_billing'];
  return !forbidden.includes(action);
}
