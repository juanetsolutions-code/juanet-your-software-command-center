export interface OptimisticOp<T> {
  id: string;
  resource: string;
  apply: (prev: T) => T;
  rollback: (prev: T) => T;
}

interface Pending<T> {
  op: OptimisticOp<T>;
  snapshot: T;
}

const pending = new Map<string, Pending<unknown>>();

export function applyOptimistic<T>(prev: T, op: OptimisticOp<T>): T {
  pending.set(op.id, { op: op as OptimisticOp<unknown>, snapshot: prev });
  return op.apply(prev);
}

export function confirmOptimistic(opId: string) {
  pending.delete(opId);
}

export function rollbackOptimistic<T>(opId: string, current: T): T {
  const p = pending.get(opId) as Pending<T> | undefined;
  if (!p) return current;
  pending.delete(opId);
  return p.op.rollback(current);
}
