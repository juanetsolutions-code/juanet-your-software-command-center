import { randomUUID } from "crypto";

export type LogContext = {
  tenantId?: string;
  userId?: string;
  requestId?: string;
  correlationId?: string;
  [key: string]: unknown;
};

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogEntry = {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  environment: "development" | "production" | "mock";
};

class LogContextManager {
  private context: LogContext = {};

  set(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
  }

  get(): LogContext {
    return { ...this.context };
  }

  clear() {
    this.context = {};
  }

  run<T>(context: Partial<LogContext>, fn: () => T): T {
    const previous = this.context;
    this.context = { ...this.context, ...context };
    try {
      return fn();
    } finally {
      this.context = previous;
    }
  }
}

export const logContext = new LogContextManager();

export function generateCorrelationId(): string {
  return randomUUID();
}

export function generateRequestId(): string {
  return `req_${randomUUID().slice(0, 8)}`;
}

export function extractCorrelationId(headers: Headers): string | undefined {
  return headers.get("x-correlation-id") ?? undefined;
}