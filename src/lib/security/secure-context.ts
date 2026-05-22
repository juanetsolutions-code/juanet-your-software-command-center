/**
 * Secure Context
 * Provides a safe execution context with tenant and user isolation.
 */

import { readSession } from "@/lib/auth/store";
import { getCurrentOrganization } from "@/lib/tenant/context";

export interface SecureContext {
  userId: string | null;
  tenantId: string | null;
  role: string | null;
  timestamp: string;
}

let currentContext: SecureContext | null = null;

export function createSecureContext(): SecureContext {
  const session = readSession();
  const org = getCurrentOrganization();

  currentContext = {
    userId: session?.user?.id ?? null,
    tenantId: org?.id ?? null,
    role: session?.user?.role ?? null,
    timestamp: new Date().toISOString(),
  };

  return currentContext;
}

export function getSecureContext(): SecureContext {
  if (!currentContext) {
    return createSecureContext();
  }
  return currentContext;
}

export function clearSecureContext(): void {
  currentContext = null;
}

export function withSecureContext<T>(fn: (ctx: SecureContext) => T): T {
  const ctx = createSecureContext();
  try {
    return fn(ctx);
  } finally {
    // Context is request-scoped in real server; here we keep it simple
  }
}
