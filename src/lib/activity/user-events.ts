/**
 * User Events - User activity tracking
 */

export type UserEventType =
  | "login"
  | "logout"
  | "project_view"
  | "request_submit"
  | "message_send"
  | "invoice_pay"
  | "download";

export interface UserEvent {
  id: string;
  userId: string;
  type: UserEventType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const mockUserEvents: UserEvent[] = [];

export function recordUserEvent(
  userId: string,
  type: UserEventType,
  metadata?: Record<string, unknown>,
): UserEvent {
  const event: UserEvent = {
    id: `ue-${Date.now()}`,
    userId,
    type,
    timestamp: new Date().toISOString(),
    metadata,
  };
  mockUserEvents.unshift(event);
  return event;
}

export function getUserEvents(userId: string, limit = 50): UserEvent[] {
  return mockUserEvents.filter((e) => e.userId === userId).slice(0, limit);
}
