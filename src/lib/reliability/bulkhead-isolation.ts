interface Bulkhead {
  maxConcurrent: number;
  inFlight: number;
  queue: Array<() => void>;
}

const bulkheads = new Map<string, Bulkhead>();

function get(name: string, maxConcurrent = 5): Bulkhead {
  let b = bulkheads.get(name);
  if (!b) {
    b = { maxConcurrent, inFlight: 0, queue: [] };
    bulkheads.set(name, b);
  }
  return b;
}

export async function withBulkhead<T>(name: string, fn: () => Promise<T>, max = 5): Promise<T> {
  const b = get(name, max);
  if (b.inFlight >= b.maxConcurrent) {
    await new Promise<void>((resolve) => b.queue.push(resolve));
  }
  b.inFlight++;
  try {
    return await fn();
  } finally {
    b.inFlight--;
    const next = b.queue.shift();
    if (next) next();
  }
}
