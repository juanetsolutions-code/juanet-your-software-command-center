export interface PresenceState {
  userId: string;
  resource: string;
  status: "active" | "idle" | "away";
  cursor?: { x: number; y: number };
  lastHeartbeat: number;
}

const presence = new Map<string, PresenceState>();

function key(userId: string, resource: string) {
  return `${userId}::${resource}`;
}

export function updatePresence(state: Omit<PresenceState, "lastHeartbeat">) {
  presence.set(key(state.userId, state.resource), { ...state, lastHeartbeat: Date.now() });
}

export function getPresenceForResource(resource: string): PresenceState[] {
  const now = Date.now();
  return Array.from(presence.values()).filter(
    (p) => p.resource === resource && now - p.lastHeartbeat < 60_000,
  );
}

export function removePresence(userId: string, resource: string) {
  presence.delete(key(userId, resource));
}
