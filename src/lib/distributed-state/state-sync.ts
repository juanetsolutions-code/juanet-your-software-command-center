export interface SyncEnvelope<T = unknown> {
  resource: string;
  id: string;
  version: number;
  updatedAt: string;
  origin: string;
  payload: T;
}

const log: SyncEnvelope[] = [];

export function recordChange<T>(env: SyncEnvelope<T>) {
  log.push(env);
  if (log.length > 1000) log.shift();
}

export function getChangesSince(version: number): SyncEnvelope[] {
  return log.filter((e) => e.version > version);
}
