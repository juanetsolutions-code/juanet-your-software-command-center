export interface FallbackRoute<T> {
  name: string;
  call: () => Promise<T>;
}

export async function callWithFallbacks<T>(routes: FallbackRoute<T>[]): Promise<{ value: T; usedRoute: string }> {
  let lastErr: unknown;
  for (const route of routes) {
    try {
      const value = await route.call();
      return { value, usedRoute: route.name };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("All fallback routes failed");
}
