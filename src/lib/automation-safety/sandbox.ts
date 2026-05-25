/**
 * Automation Safety - Sandbox and execution limits.
 */

export function createSandbox() {
  return {
    execute: (fn: Function, timeoutMs = 5000) => {
      // Simple timeout guard (in real use vm2 or worker)
      return Promise.race([
        Promise.resolve(fn()),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Execution timeout")), timeoutMs),
        ),
      ]);
    },
  };
}
