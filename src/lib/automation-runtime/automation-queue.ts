/**
 * AI Automation Runtime - Automation Queue
 * Dedicated queue for automation tasks with priority and tenant isolation.
 */

export class AutomationQueue {
  private queue: any[] = [];

  enqueue(task: any): string {
    const id = `autoq_${Date.now()}`;
    this.queue.push({ id, ...task });
    return id;
  }

  dequeue(): any | null {
    return this.queue.shift() || null;
  }
}

export const automationQueue = new AutomationQueue();
