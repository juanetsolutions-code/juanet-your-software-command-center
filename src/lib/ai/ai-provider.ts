/**
 * AI Provider Abstract Base
 * All concrete providers (OpenAI, Anthropic, Grok, Local) must extend this.
 */

import type { AIProvider, AIRequest, AIResponse, AIProviderType } from "./ai-types";

export abstract class BaseAIProvider implements AIProvider {
  abstract readonly type: AIProviderType;

  abstract isAvailable(): Promise<boolean>;

  abstract generate(request: AIRequest): Promise<AIResponse>;

  // Optional streaming support
  async *stream(request: AIRequest): AsyncIterable<string> {
    // Default implementation falls back to non-streaming
    const response = await this.generate(request);
    yield response.content;
  }

  protected sanitizeRequest(request: AIRequest): AIRequest {
    // Basic safety sanitization
    return {
      ...request,
      prompt: request.prompt?.slice(0, 10000) || "",
    };
  }
}
