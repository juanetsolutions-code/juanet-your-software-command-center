import { logger, type LogContext } from "./logger";
import { getMetrics, type MetricTags } from "./metrics";
import { tracer, type TraceOptions } from "./tracer";

export type ObservabilityClientConfig = {
  service: string;
  environment: "development" | "production" | "mock";
  enabled?: boolean;
};

class ObservabilityClient {
  private config: ObservabilityClientConfig;

  constructor(config: ObservabilityClientConfig) {
    this.config = config;
  }

  log(level: "debug" | "info" | "warn" | "error", message: string, context?: LogContext): void {
    if (!this.config.enabled) return;
    logger[level](message, context);
  }

  metric(name: string, value: number, tags?: MetricTags): void {
    if (!this.config.enabled) return;
    import("./metrics").then(({ incrementMetric }) => incrementMetric(name, value, tags));
  }

  trace<T>(options: TraceOptions, fn: (span: ReturnType<typeof tracer.startSpan>) => T): T {
    if (!this.config.enabled) return fn({} as any);
    return tracer.startSpan(options) as any;
  }

  async traceAsync<T>(options: TraceOptions, fn: (span: any) => Promise<T>): Promise<T> {
    if (!this.config.enabled) return fn({} as any);
    const span = tracer.startSpan(options);
    try {
      return await fn(span);
    } catch (error) {
      tracer.endSpan(span, "error", error as Error);
      throw error;
    }
  }

  getConfig(): ObservabilityClientConfig {
    return { ...this.config };
  }
}

let clientInstance: ObservabilityClient | null = null;

export function createObservabilityClient(config: ObservabilityClientConfig): ObservabilityClient {
  clientInstance = new ObservabilityClient(config);
  return clientInstance;
}

export function getObservabilityClient(): ObservabilityClient {
  if (!clientInstance) {
    clientInstance = createObservabilityClient({
      service: "juanet",
      environment: "mock",
      enabled: true,
    });
  }
  return clientInstance;
}