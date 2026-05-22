/**
 * Global Error Tracking System
 * Production hardening layer for capturing and structuring errors.
 * Safe: never throws, only logs.
 */

import { logger } from "@/lib/utils/logger";
import { readSession } from "@/lib/auth/store";
import { getCurrentOrganization } from "@/lib/tenant/context";

export interface TrackedError {
  message: string;
  stack?: string;
  context: string;
  userId?: string | null;
  tenantId?: string | null;
  timestamp: string;
  extra?: Record<string, unknown>;
}

const errorHistory: TrackedError[] = [];
const MAX_HISTORY = 100;

export function trackError(
  error: unknown,
  context: string,
  extra?: Record<string, unknown>,
): TrackedError {
  const session = readSession();
  const org = getCurrentOrganization();

  const tracked: TrackedError = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    userId: session?.user?.id ?? null,
    tenantId: org?.id ?? null,
    timestamp: new Date().toISOString(),
    extra,
  };

  errorHistory.push(tracked);
  if (errorHistory.length > MAX_HISTORY) {
    errorHistory.shift();
  }

  // Safe logging only
  logger.error(`[ErrorTracker] ${context}:`, tracked);

  return tracked;
}

export function getRecentErrors(limit = 20): TrackedError[] {
  return errorHistory.slice(-limit);
}

export function clearErrorHistory(): void {
  errorHistory.length = 0;
}

// Convenience wrappers for common failure points
export const errorTracker = {
  api: (err: unknown, endpoint: string, extra?: Record<string, unknown>) =>
    trackError(err, `API:${endpoint}`, extra),
  supabase: (err: unknown, operation: string, extra?: Record<string, unknown>) =>
    trackError(err, `Supabase:${operation}`, extra),
  repository: (err: unknown, repo: string, method: string, extra?: Record<string, unknown>) =>
    trackError(err, `Repo:${repo}.${method}`, extra),
  auth: (err: unknown, action: string, extra?: Record<string, unknown>) =>
    trackError(err, `Auth:${action}`, extra),
};

export default errorTracker;
