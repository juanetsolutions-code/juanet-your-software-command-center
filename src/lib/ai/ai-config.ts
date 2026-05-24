/**
 * AI Configuration - Central configuration for AI providers.
 * Supports environment-based and tenant-based overrides.
 */

import type { AIProviderConfig, AIProviderType, AIModel } from "./ai-types";

const DEFAULT_CONFIG: Record<AIProviderType, AIProviderConfig> = {
  openai: {
    defaultModel: "gpt-4o-mini",
    enabled: false, // disabled by default for safety
  },
  anthropic: {
    defaultModel: "claude-3-5-sonnet",
    enabled: false,
  },
  grok: {
    defaultModel: "grok-2",
    enabled: false,
  },
  local: {
    defaultModel: "local-llm",
    enabled: false,
  },
};

export const AI_CONFIG = {
  providers: DEFAULT_CONFIG,

  getProviderConfig(provider: AIProviderType): AIProviderConfig {
    return this.providers[provider] || DEFAULT_CONFIG.openai;
  },

  isProviderEnabled(provider: AIProviderType): boolean {
    return this.providers[provider]?.enabled ?? false;
  },

  // Future: load from database per tenant
  getTenantConfig(tenantId: string, provider: AIProviderType) {
    // Placeholder for tenant-specific overrides
    return this.getProviderConfig(provider);
  },
};

export function loadAIConfigFromEnv() {
  // In real implementation, read from process.env or config service
  if (process.env.OPENAI_API_KEY) {
    AI_CONFIG.providers.openai.enabled = true;
    // AI_CONFIG.providers.openai.apiKey = process.env.OPENAI_API_KEY;
  }
  // Similar for others...
}
