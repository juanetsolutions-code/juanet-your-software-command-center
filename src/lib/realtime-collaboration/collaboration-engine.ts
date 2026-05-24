export interface CollaborationSession {
  id: string;
  resource: string;
  tenantId: string;
  participants: string[];
  startedAt: string;
}

const sessions = new Map<string, CollaborationSession>();

export function startSession(resource: string, tenantId: string, initialUserId: string): CollaborationSession {
  const id = `collab_${resource}_${Date.now()}`;
  const session: CollaborationSession = {
    id,
    resource,
    tenantId,
    participants: [initialUserId],
    startedAt: new Date().toISOString(),
  };
  sessions.set(id, session);
  return session;
}

export function joinSession(sessionId: string, userId: string) {
  const s = sessions.get(sessionId);
  if (s && !s.participants.includes(userId)) s.participants.push(userId);
  return s ?? null;
}

export function leaveSession(sessionId: string, userId: string) {
  const s = sessions.get(sessionId);
  if (!s) return;
  s.participants = s.participants.filter((p) => p !== userId);
  if (s.participants.length === 0) sessions.delete(sessionId);
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}
