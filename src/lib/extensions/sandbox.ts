/**
 * Extension Sandbox
 * Isolation and permission boundaries for running extensions.
 */

export function createSandbox(extensionId: string) {
  return {
    id: extensionId,
    run: (code: string) => {
      // Placeholder - real impl would use VM2 or similar
      console.log(`[Sandbox] Executing extension ${extensionId}`);
      return { success: true };
    },
  };
}
