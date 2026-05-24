type Listener<T> = (value: T) => void;

interface SharedDoc<T> {
  value: T;
  version: number;
  listeners: Set<Listener<T>>;
}

const docs = new Map<string, SharedDoc<unknown>>();

export function getSharedState<T>(key: string, initial: T): T {
  if (!docs.has(key)) {
    docs.set(key, { value: initial, version: 0, listeners: new Set() });
  }
  return docs.get(key)!.value as T;
}

export function setSharedState<T>(key: string, value: T) {
  const doc = docs.get(key);
  if (!doc) {
    docs.set(key, { value, version: 1, listeners: new Set() });
    return;
  }
  doc.value = value;
  doc.version++;
  doc.listeners.forEach((l) => (l as Listener<T>)(value));
}

export function subscribeSharedState<T>(key: string, listener: Listener<T>): () => void {
  const doc = docs.get(key);
  if (!doc) return () => {};
  doc.listeners.add(listener as Listener<unknown>);
  return () => doc.listeners.delete(listener as Listener<unknown>);
}
