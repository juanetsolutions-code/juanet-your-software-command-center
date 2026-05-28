import type { CacheEntry } from "./cache-provider";

export type CacheInvalidationRule = {
  pattern: string;
  reason?: string;
};

class CacheInvalidation {
  private rules: CacheInvalidationRule[] = [];
  private invalidationLog: Array<{ key: string; pattern: string; timestamp: string }> = [];

  addRule(rule: CacheInvalidationRule): void {
    this.rules.push(rule);
  }

  removeRule(pattern: string): void {
    this.rules = this.rules.filter((r) => r.pattern !== pattern);
  }

  shouldInvalidate(key: string): boolean {
    return this.rules.some((rule) => this.matchPattern(key, rule.pattern));
  }

  invalidate(key: string): void {
    const matchedRule = this.rules.find((rule) => this.matchPattern(key, rule.pattern));
    if (matchedRule) {
      this.invalidationLog.push({
        key,
        pattern: matchedRule.pattern,
        timestamp: new Date().toISOString(),
      });
    }
  }

  getRules(): CacheInvalidationRule[] {
    return [...this.rules];
  }

  getInvalidationLog(): Array<{ key: string; pattern: string; timestamp: string }> {
    return [...this.invalidationLog];
  }

  private matchPattern(key: string, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern.endsWith("*")) {
      return key.startsWith(pattern.slice(0, -1));
    }
    if (pattern.startsWith("*")) {
      return key.endsWith(pattern.slice(1));
    }
    return key === pattern;
  }
}

export const cacheInvalidation = new CacheInvalidation();

export function addInvalidationRule(rule: CacheInvalidationRule): void {
  cacheInvalidation.addRule(rule);
}

export function clearInvalidationRules(): void {
  cacheInvalidation.rules = [];
}