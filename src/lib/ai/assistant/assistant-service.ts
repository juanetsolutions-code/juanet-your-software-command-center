/**
 * AI Assistant Service
 * Multi-tenant, permission-aware assistant service (no UI).
 */

import type { AIContext, AIRequest, AIResponse } from "../ai-types";
import { getAIProvider, selectBestProvider } from "../ai-registry";
import { buildAIContext } from "../ai-context";

export class AssistantService {
  async chat(message: string, context: Partial<AIContext>, tenantId: string): Promise<AIResponse> {
    const fullContext = buildAIContext(tenantId, context);

    // Permission check placeholder
    if (!fullContext.permissions?.includes("ai_assistant")) {
      throw new Error("AI Assistant access denied for this tenant/user");
    }

    const provider = await selectBestProvider();
    if (!provider) {
      throw new Error("No AI provider available");
    }

    const request: AIRequest = {
      prompt: message,
      context: fullContext,
      tenantId,
    };

    return provider.generate(request);
  }
}

export const assistantService = new AssistantService();
