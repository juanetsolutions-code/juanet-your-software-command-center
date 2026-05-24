/**
 * Built-in Tools - Default safe tools available to AI agents.
 * These map to real backend capabilities via adapters.
 */

import { registerTool } from './tool-registry';
import type { ToolDefinition } from './tool-types';

const builtInTools: ToolDefinition[] = [
  {
    name: 'createInvoice',
    description: 'Create an invoice for a tenant or project',
    parameters: {
      tenantId: { type: 'string', required: true },
      amount: { type: 'number', required: true },
      description: { type: 'string' },
    },
    requiredPermissions: ['billing:write'],
    safeForAgentRoles: ['finance', 'admin', '*'],
  },
  {
    name: 'sendNotification',
    description: 'Send an internal notification or alert',
    parameters: {
      type: { type: 'string', required: true },
      message: { type: 'string', required: true },
      recipientRole: { type: 'string' },
    },
    requiredPermissions: ['notifications:send'],
    safeForAgentRoles: ['support', 'ops', 'admin', '*'],
  },
  {
    name: 'triggerWorkflow',
    description: 'Trigger an existing automation workflow',
    parameters: {
      workflowId: { type: 'string', required: true },
      payload: { type: 'object' },
    },
    requiredPermissions: ['automation:trigger'],
    safeForAgentRoles: ['ops', 'admin', '*'],
  },
  {
    name: 'queryMetrics',
    description: 'Query system or tenant metrics safely',
    parameters: {
      metricType: { type: 'string', required: true },
      filters: { type: 'object' },
    },
    requiredPermissions: ['metrics:read'],
    safeForAgentRoles: ['admin', 'ops', '*'],
  },
];

export function registerBuiltInTools() {
  builtInTools.forEach(registerTool);
  console.log('[AI Tools] Registered built-in tools for agents');
}

// Auto-register when the module is imported
registerBuiltInTools();
