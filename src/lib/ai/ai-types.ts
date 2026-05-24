/**
 * AI Types - Core type definitions for the AI platform foundation.
 * Provider-agnostic design to support multiple AI backends.
 */

export type AIModel = "gpt-4o" | "gpt-4o-mini" | "claude-3-5-sonnet" | "grok-2" | "local-llm";

export type AIProviderType = "openai" | "anthropic" | "grok" | "local";

export interface AIRequest {
  prompt: string;
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  context?: Record<string, any>;
  tenantId?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: AIProviderType;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

export interface AIProvider {
  type: AIProviderType;
  isAvailable(): Promise<boolean>;
  generate(request: AIRequest): Promise<AIResponse>;
  stream?(request: AIRequest): AsyncIterable<string>; // optional streaming
}

export interface AIProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  defaultModel: AIModel;
  enabled: boolean;
}

export interface AIContext {
  tenantId: string;
  userId?: string;
  workspaceId?: string;
  recentMessages?: any[];
  projectContext?: Record<string, any>;
  permissions?: string[];
}
