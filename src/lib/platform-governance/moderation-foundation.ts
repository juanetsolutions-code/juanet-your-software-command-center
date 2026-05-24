/**
 * Moderation Foundation
 */

export interface ModerationAction {
  tenantId: string;
  type: "warning" | "suspension" | "content_removal";
  reason: string;
  timestamp: string;
}

const actions: ModerationAction[] = [];

export function logModerationAction(action: Omit<ModerationAction, "timestamp">) {
  actions.push({ ...action, timestamp: new Date().toISOString() });
}
