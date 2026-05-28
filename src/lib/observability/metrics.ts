export type MetricType = "counter" | "gauge" | "histogram" | "timer";

export type MetricValue = number | { value: number; tags?: Record<string, string> };

export type MetricTags = Record<string, string>;

export type MetricDefinition = {
  name: string;
  type: MetricType;
  description: string;
  unit?: string;
};

export type MetricSnapshot = {
  name: string;
  value: number;
  type: MetricType;
  timestamp: string;
  tags?: MetricTags;
};

class MetricsRegistry {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private timers: Map<string, number[]> = new Map();
  private definitions: Map<string, MetricDefinition> = new Map();

  define(def: MetricDefinition) {
    this.definitions.set(def.name, def);
  }

  increment(name: string, value: number = 1, tags?: MetricTags) {
    const current = this.counters.get(name) ?? 0;
    this.counters.set(name, current + value);
  }

  decrement(name: string, value: number = 1, tags?: MetricTags) {
    this.increment(name, -value, tags);
  }

  gauge(name: string, value: number, tags?: MetricTags) {
    const key = this.getTagKey(name, tags);
    this.gauges.set(key, value);
  }

  histogram(name: string, value: number, tags?: MetricTags) {
    const key = this.getTagKey(name, tags);
    const values = this.histograms.get(key) ?? [];
    values.push(value);
    this.histograms.set(key, values);
  }

  timerStart(name: string): string {
    return generateTimerId(name);
  }

  timerEnd(timerId: string, tags?: MetricTags): void {
    const [, name, start] = parseTimerId(timerId);
    const duration = Date.now() - start;
    this.timer(name, duration, tags);
  }

  private timer(name: string, value: number, tags?: MetricTags) {
    const key = this.getTagKey(name, tags);
    const values = this.timers.get(key) ?? [];
    values.push(value);
    this.timers.set(key, values);
  }

  getSnapshot(name: string): MetricSnapshot | undefined {
    if (this.counters.has(name)) {
      return {
        name,
        value: this.counters.get(name)!,
        type: "counter",
        timestamp: new Date().toISOString(),
      };
    }
    if (this.gauges.has(name)) {
      return {
        name,
        value: this.gauges.get(name)!,
        type: "gauge",
        timestamp: new Date().toISOString(),
      };
    }
    return undefined;
  }

  getAllSnapshots(): MetricSnapshot[] {
    const snapshots: MetricSnapshot[] = [];
    const timestamp = new Date().toISOString();

    for (const [name, value] of this.counters) {
      snapshots.push({ name, value, type: "counter", timestamp });
    }
    for (const [key, value] of this.gauges) {
      snapshots.push({ name: this.getNameFromKey(key), value, type: "gauge", timestamp });
    }
    for (const [key, values] of this.histograms) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      snapshots.push({ name: this.getNameFromKey(key), value: avg, type: "histogram", timestamp });
    }
    for (const [key, values] of this.timers) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      snapshots.push({ name: this.getNameFromKey(key), value: avg, type: "timer", timestamp });
    }

    return snapshots;
  }

  reset() {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.timers.clear();
  }

  private getTagKey(name: string, tags?: MetricTags): string {
    if (!tags || Object.keys(tags).length === 0) return name;
    const tagStr = Object.entries(tags).map(([k, v]) => `${k}=${v}`).join(",");
    return `${name}{${tagStr}}`;
  }

  private getNameFromKey(key: string): string {
    const match = key.match(/^([^{]+)/);
    return match ? match[1] : key;
  }
}

const metrics = new MetricsRegistry();

export function getMetrics(): MetricsRegistry {
  return metrics;
}

export function defineMetric(def: MetricDefinition): void {
  metrics.define(def);
}

export function incrementMetric(name: string, value?: number, tags?: MetricTags): void {
  metrics.increment(name, value, tags);
}

export function gaugeMetric(name: string, value: number, tags?: MetricTags): void {
  metrics.gauge(name, value, tags);
}

export function histogramMetric(name: string, value: number, tags?: MetricTags): void {
  metrics.histogram(name, value, tags);
}

export function startTimer(name: string): string {
  return metrics.timerStart(name);
}

export function endTimer(timerId: string, tags?: MetricTags): void {
  metrics.timerEnd(timerId, tags);
}

function generateTimerId(name: string): string {
  return `timer:${name}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

function parseTimerId(id: string): [string, string, number] {
  const [, name, start] = id.split(":");
  return [id, name!, parseInt(start!)];
}