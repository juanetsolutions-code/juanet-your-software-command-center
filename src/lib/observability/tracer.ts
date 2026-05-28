import { generateCorrelationId } from "./log-context";

export type SpanKind = "server" | "client" | "internal" | "producer" | "consumer";

export type SpanStatus = "ok" | "error";

export type Span = {
  id: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  kind: SpanKind;
  startTime: number;
  endTime?: number;
  status: SpanStatus;
  attributes: Record<string, unknown>;
  events: Array<{ timestamp: number; name: string; attributes?: Record<string, unknown> }>;
};

export type TraceOptions = {
  name: string;
  kind?: SpanKind;
  traceId?: string;
  parentSpanId?: string;
  attributes?: Record<string, unknown>;
};

class Tracer {
  private spans: Span[] = [];
  private activeSpans: Map<string, Span> = new Map();

  startSpan(options: TraceOptions): Span {
    const span: Span = {
      id: generateCorrelationId(),
      traceId: options.traceId ?? generateCorrelationId(),
      parentSpanId: options.parentSpanId,
      name: options.name,
      kind: options.kind ?? "internal",
      startTime: Date.now(),
      status: "ok",
      attributes: options.attributes ?? {},
      events: [],
    };

    this.activeSpans.set(span.id, span);
    return span;
  }

  endSpan(span: Span, status: SpanStatus = "ok", error?: Error) {
    span.endTime = Date.now();
    span.status = status;

    if (error) {
      span.attributes.error = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    }

    this.activeSpans.delete(span.id);
    this.spans.push(span);
  }

  addEvent(span: Span, name: string, attributes?: Record<string, unknown>) {
    span.events.push({
      timestamp: Date.now(),
      name,
      attributes,
    });
  }

  setAttribute(span: Span, key: string, value: unknown) {
    span.attributes[key] = value;
  }

  getTrace(traceId: string): Span[] {
    return this.spans.filter((s) => s.traceId === traceId);
  }

  getSpan(spanId: string): Span | undefined {
    return this.activeSpans.get(spanId);
  }

  getAllTraces(): Span[] {
    return [...this.spans];
  }

  clear() {
    this.spans = [];
    this.activeSpans.clear();
  }
}

export const tracer = new Tracer();

export function startTrace(options: TraceOptions): Span {
  return tracer.startSpan(options);
}

export function endTrace(span: Span, status?: SpanStatus, error?: Error): void {
  tracer.endSpan(span, status, error);
}

export function addTraceEvent(span: Span, name: string, attributes?: Record<string, unknown>): void {
  tracer.addEvent(span, name, attributes);
}

export function setTraceAttribute(span: Span, key: string, value: unknown): void {
  tracer.setAttribute(span, key, value);
}

export function withSpan<T>(options: TraceOptions, fn: (span: Span) => T): T {
  const span = startTrace(options);
  try {
    const result = fn(span);
    endTrace(span, "ok");
    return result;
  } catch (error) {
    endTrace(span, "error", error as Error);
    throw error;
  }
}