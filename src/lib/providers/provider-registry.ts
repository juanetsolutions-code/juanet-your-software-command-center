/**
 * Provider Registry
 * Central registry for all external providers (AI, billing, email, storage, etc.).
 */

export interface RegisteredProvider {
  name: string;
  type: "ai" | "billing" | "email" | "storage" | "other";
  healthEndpoint?: string;
}

export class ProviderRegistry {
  private providers: RegisteredProvider[] = [];

  register(provider: RegisteredProvider): void {
    this.providers.push(provider);
  }

  getAll(): RegisteredProvider[] {
    return [...this.providers];
  }

  getByType(type: RegisteredProvider["type"]): RegisteredProvider[] {
    return this.providers.filter((p) => p.type === type);
  }
}

export const providerRegistry = new ProviderRegistry();
