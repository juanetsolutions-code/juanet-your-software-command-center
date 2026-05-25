export type ConflictStrategy = "last-write-wins" | "first-write-wins" | "merge" | "manual";

export interface ConflictInput<T> {
  local: { value: T; updatedAt: string };
  remote: { value: T; updatedAt: string };
  strategy?: ConflictStrategy;
  merge?: (l: T, r: T) => T;
}

export function resolveConflict<T>(input: ConflictInput<T>): { value: T; needsManual: boolean } {
  const strategy = input.strategy ?? "last-write-wins";
  switch (strategy) {
    case "first-write-wins":
      return {
        value:
          input.local.updatedAt <= input.remote.updatedAt ? input.local.value : input.remote.value,
        needsManual: false,
      };
    case "merge":
      return {
        value: input.merge
          ? input.merge(input.local.value, input.remote.value)
          : input.remote.value,
        needsManual: false,
      };
    case "manual":
      return { value: input.local.value, needsManual: true };
    case "last-write-wins":
    default:
      return {
        value:
          input.local.updatedAt >= input.remote.updatedAt ? input.local.value : input.remote.value,
        needsManual: false,
      };
  }
}
