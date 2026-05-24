export async function degradeOnFailure<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T> | T,
): Promise<T> {
  try {
    return await primary();
  } catch {
    return await fallback();
  }
}
