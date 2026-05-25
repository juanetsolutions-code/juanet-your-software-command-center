/**
 * Job Queue Simulation
 */

const queue: Array<{ name: string; data: any; runAt: number }> = [];

export function enqueueJob(name: string, data: any, delayMs = 0) {
  queue.push({
    name,
    data,
    runAt: Date.now() + delayMs,
  });
}

export function dequeueDueJobs(): any[] {
  const now = Date.now();
  const due = queue.filter((j) => j.runAt <= now);
  // remove from queue
  for (let i = queue.length - 1; i >= 0; i--) {
    if (queue[i].runAt <= now) queue.splice(i, 1);
  }
  return due;
}
