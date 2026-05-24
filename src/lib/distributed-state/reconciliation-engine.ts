import { resolveConflict, type ConflictStrategy } from "./conflict-resolution";

export interface ReconcileInput<T> {
  local: Map<string, { value: T; updatedAt: string }>;
  remote: Map<string, { value: T; updatedAt: string }>;
  strategy?: ConflictStrategy;
}

export function reconcile<T>(input: ReconcileInput<T>): Map<string, T> {
  const out = new Map<string, T>();
  const keys = new Set<string>([...input.local.keys(), ...input.remote.keys()]);
  for (const k of keys) {
    const l = input.local.get(k);
    const r = input.remote.get(k);
    if (l && r) {
      out.set(k, resolveConflict({ local: l, remote: r, strategy: input.strategy }).value);
    } else if (l) out.set(k, l.value);
    else if (r) out.set(k, r.value);
  }
  return out;
}
