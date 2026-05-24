/**
 * Extension Loader (sandboxed loading prep).
 */

export function loadExtension(id: string) {
  // In real system: dynamic import from verified source with sandbox
  console.log(`[Extensions] Loading extension ${id} (sandboxed mode)`);
  return { loaded: true, id };
}
