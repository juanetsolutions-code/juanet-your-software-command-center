/**
 * Contextual Memory
 * Short-to-medium term context that persists across related operations and sessions.
 */

export interface ContextualMemoryFrame {
  id: string;
  tenantId: string;
  contextKey: string;
  content: Record<string, any>;
  ttlMinutes: number;
  createdAt: string;
  expiresAt: string;
}

export class ContextualMemory {
  private frames: ContextualMemoryFrame[] = [];

  setFrame(
    frame: Omit<ContextualMemoryFrame, "id" | "createdAt" | "expiresAt">,
  ): ContextualMemoryFrame {
    const now = Date.now();
    const full: ContextualMemoryFrame = {
      ...frame,
      id: `ctx-${now}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(now + frame.ttlMinutes * 60000).toISOString(),
    };
    this.frames.push(full);
    return full;
  }

  getActive(tenantId: string, contextKey?: string): ContextualMemoryFrame[] {
    const now = new Date();
    return this.frames.filter(
      (f) =>
        f.tenantId === tenantId &&
        (!contextKey || f.contextKey === contextKey) &&
        new Date(f.expiresAt) > now,
    );
  }
}

export const contextualMemory = new ContextualMemory();
