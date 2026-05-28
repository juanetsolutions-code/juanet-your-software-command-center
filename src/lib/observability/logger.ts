import { logContext, type LogContext, type LogEntry, type LogLevel, generateCorrelationId } from "./log-context";

export class Logger {
  private environment: "development" | "production" | "mock";
  private logs: LogEntry[] = [];

  constructor(environment: "development" | "production" | "mock" = "mock") {
    this.environment = environment;
  }

  private write(entry: LogEntry) {
    if (this.environment === "mock") {
      this.logs.push(entry);
      return;
    }

    const output = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      ...entry.context,
    };

    if (this.environment === "development") {
      console[entry.level](JSON.stringify(output));
    } else {
      if (entry.level === "error") {
        console.error(JSON.stringify(output));
      } else if (entry.level === "warn") {
        console.warn(JSON.stringify(output));
      }
    }
  }

  private createEntry(level: LogLevel, message: string, context: LogContext = {}): LogEntry {
    const baseContext = logContext.get();
    const mergedContext = { ...baseContext, ...context };
    
    return {
      id: generateCorrelationId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      context: mergedContext,
      environment: this.environment,
    };
  }

  debug(message: string, context?: LogContext) {
    this.write(this.createEntry("debug", message, context));
  }

  info(message: string, context?: LogContext) {
    this.write(this.createEntry("info", message, context));
  }

  warn(message: string, context?: LogContext) {
    this.write(this.createEntry("warn", message, context));
  }

  error(message: string, context?: LogContext) {
    this.write(this.createEntry("error", message, context));
  }

  child(bindings: Partial<LogContext>): Logger {
    const childLogger = new Logger(this.environment);
    childLogger.setBindings(bindings);
    return childLogger;
  }

  private setBindings(bindings: Partial<LogContext>) {
    logContext.set(bindings);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

let loggerInstance: Logger | null = null;

export function getLogger(environment?: "development" | "production" | "mock"): Logger {
  if (!loggerInstance || environment) {
    const env = environment ?? (process.env.NODE_ENV === "production" ? "production" : "mock");
    loggerInstance = new Logger(env);
  }
  return loggerInstance;
}

export const logger = getLogger();