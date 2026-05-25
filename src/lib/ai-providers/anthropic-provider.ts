/**
 * AI Provider Abstraction Layer - Anthropic Provider
 * Concrete implementation for Anthropic Claude models.
 */

export class AnthropicProvider {
  async complete(prompt: string, model = "claude-3"): Promise<any> {
    return { provider: "anthropic", model, response: "stub_response" };
  }
}

export const anthropicProvider = new AnthropicProvider();
