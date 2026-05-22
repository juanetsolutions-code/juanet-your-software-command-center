/**
 * Audit logging foundation.
 * Tracks important events for compliance/security.
 * Currently dev-only (console), future: ship to DB or external service.
 */

import { logger } from "@/lib/utils/logger";

export type AuditEvent =
  | "auth.login"
  | "auth.signup"
  | "auth.logout"
  | "repo.create"
  | "repo.update"
  | "repo.delete"
  | "permission.denied"
  | "fallback.mock"
  | "tenant.switch";

export interface AuditLog {
  event: AuditEvent;
  actorId?: string | null;
  resource?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export function logAudit(event: AuditEvent, meta: Omit<AuditLog, "event" | "timestamp"> = {}) {
  const entry: AuditLog = {
    event,
    ...meta,
    timestamp: new Date().toISOString(),
  };

  // Always log via existing logger (respects dev/prod)
  logger.info("[AUDIT]", entry);

  // Future: persist to audit_logs table when ready
  // if (SUPABASE_READY) { await supabase.from("audit_logs").insert(...) }
}

export const audit = {
  log: logAudit,
  login: (actorId?: string) => logAudit("auth.login", { actorId }),
  mutation: (action: string, resource: string, actorId?: string) =>
    logAudit("repo.create", { actorId, resource, details: { action } }),
  permissionDenied: (resource: string, actorId?: string) =>
    logAudit("permission.denied", { actorId, resource }),
  fallback: (reason: string) => logAudit("fallback.mock", { details: { reason } }),
};
