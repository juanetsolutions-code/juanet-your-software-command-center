/**
 * AI Context Builder
 * Builds safe, tenant-aware context for AI requests.
 */

import type { AIContext } from "./ai-types";

export function buildAIContext(tenantId: string, options: Partial<AIContext> = {}): AIContext {
  return {
    tenantId,
    userId: options.userId,
    workspaceId: options.workspaceId,
    recentMessages: options.recentMessages?.slice(0, 20), // limit context size
    projectContext: options.projectContext,
    permissions: options.permissions || [],
  };
}

export function sanitizeContextForAI(context: AIContext): Partial<AIContext> {
  // Remove sensitive data before sending to AI
  const { tenantId, userId, workspaceId, ...safe } = context;
  return {
    ...safe,
    tenantId: "REDACTED", // never leak real tenant id to model unless necessary
  };
}
