/**
 * Copilot Context
 * Tenant-aware, secure context management for AI copilots.
 */

export interface CopilotContext {
  tenantId: string;
  userId?: string;
  organizationId?: string;
  activeResources: string[];
  knowledgeScope: string[];
  riskLevel: "low" | "medium" | "high";
  memoryReferences: string[];
}

export class CopilotContextManager {
  buildContext(tenantId: string, overrides: Partial<CopilotContext> = {}): CopilotContext {
    return {
      tenantId,
      activeResources: [],
      knowledgeScope: ["tenant", "organization"],
      riskLevel: "medium",
      memoryReferences: [],
      ...overrides,
    };
  }

  validateContext(context: CopilotContext): boolean {
    return !!context.tenantId && context.knowledgeScope.length > 0;
  }
}

export const copilotContextManager = new CopilotContextManager();
