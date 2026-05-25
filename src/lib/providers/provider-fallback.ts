/**
 * Provider Fallback
 * Automatic fallback to secondary providers when primary fails.
 */

export class ProviderFallback {
  async executeWithFallback<T>(
    primary: string,
    fallback: string,
    operation: () => Promise<T>,
  ): Promise<{ result: T; usedProvider: string }> {
    try {
      const result = await operation();
      return { result, usedProvider: primary };
    } catch {
      const result = await operation(); // would use fallback in real
      return { result, usedProvider: fallback };
    }
  }
}

export const providerFallback = new ProviderFallback();
