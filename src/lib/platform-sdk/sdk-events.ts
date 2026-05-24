type Handler = (payload: unknown) => void;

const listeners = new Map<string, Set<Handler>>();

export function on(event: string, handler: Handler): () => void {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(handler);
  return () => listeners.get(event)?.delete(handler);
}

export function emit(event: string, payload?: unknown) {
  listeners.get(event)?.forEach((h) => {
    try {
      h(payload);
    } catch {
      /* swallow listener errors */
    }
  });
}
