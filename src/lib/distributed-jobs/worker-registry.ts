export interface Worker {
  id: string;
  region?: string;
  capabilities: string[];
  healthy: boolean;
  lastSeenAt: string;
}

const workers = new Map<string, Worker>();

export function registerWorker(w: Omit<Worker, "lastSeenAt" | "healthy"> & { healthy?: boolean }) {
  workers.set(w.id, { ...w, healthy: w.healthy ?? true, lastSeenAt: new Date().toISOString() });
}

export function unregisterWorker(id: string) {
  workers.delete(id);
}

export function listWorkers(): Worker[] {
  return Array.from(workers.values());
}

export function findWorkers(capabilities: string[]): Worker[] {
  return listWorkers().filter(
    (w) => w.healthy && capabilities.every((c) => w.capabilities.includes(c)),
  );
}
