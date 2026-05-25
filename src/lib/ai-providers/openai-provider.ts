/**
 * AI Provider Abstraction Layer - OpenAI Provider
 * Concrete implementation for OpenAI models.
 */

export class OpenAIProvider {
  async complete(prompt: string, model = "gpt-4"): Promise<any> {
    // Production stub
    return { provider: "openai", model, response: "stub_response" };
  }
}

export const openaiProvider = new OpenAIProvider();
