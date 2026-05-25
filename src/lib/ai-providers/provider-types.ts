/**
 * AI Provider Abstraction Layer - Provider Types
 * Shared types for AI providers.
 */

export interface AIProvider {
  name: string;
  complete(prompt: string, options?: any): Promise<any>;
  getUsage(): { tokens: number; cost: number };
}

export interface ProviderRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  tenantId: string;
}
