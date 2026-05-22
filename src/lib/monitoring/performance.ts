/**
 * Performance Monitoring Layer
 * Lightweight timers for API, repository, and cache operations.
 * Dev-safe only. No external reporting.
 */

import { logger } from "@/lib/utils/logger";

interface Timer {
  label: string;
  start: number;
}

const activeTimers = new Map<string, Timer>();
const metrics: Record<string, number[]> = {}; // label -> array of durations (ms)

export function startTimer(label: string): void {
  activeTimers.set(label, {
    label,
    start: performance.now(),
  });
}

export function endTimer(label: string): number | null {
  const timer = activeTimers.get(label);
  if (!timer) {
    logger.warn(`[Performance] No active timer for "${label}"`);
    return null;
  }

  const duration = performance.now() - timer.start;
  activeTimers.delete(label);

  if (!metrics[label]) metrics[label] = [];
  metrics[label].push(duration);

  // Keep only last 50 samples per metric
  if (metrics[label].length > 50) metrics[label].shift();

  const avg = metrics[label].reduce((a, b) => a + b, 0) / metrics[label].length;

  logger.info(
    `[Performance] ${label} took ${duration.toFixed(1)}ms (avg: ${avg.toFixed(1)}ms, samples: ${metrics[label].length})`,
  );

  return duration;
}

// Cache-specific helpers
let cacheHits = 0;
let cacheMisses = 0;

export function recordCacheHit(): void {
  cacheHits++;
}

export function recordCacheMiss(): void {
  cacheMisses++;
}

export function getCacheStats() {
  const total = cacheHits + cacheMisses;
  const hitRate = total > 0 ? (cacheHits / total) * 100 : 0;
  return {
    hits: cacheHits,
    misses: cacheMisses,
    hitRate: hitRate.toFixed(1) + "%",
  };
}

export function resetCacheStats(): void {
  cacheHits = 0;
  cacheMisses = 0;
}

// Summary for observability
export function getPerformanceSummary() {
  const summary: Record<string, { avg: number; samples: number }> = {};
  for (const [label, samples] of Object.entries(metrics)) {
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    summary[label] = { avg: Number(avg.toFixed(1)), samples: samples.length };
  }
  return {
    timers: summary,
    cache: getCacheStats(),
  };
}

export const performanceMonitor = {
  start: startTimer,
  end: endTimer,
  cacheHit: recordCacheHit,
  cacheMiss: recordCacheMiss,
  getSummary: getPerformanceSummary,
};

export default performanceMonitor;
