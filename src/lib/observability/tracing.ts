/**
 * Global Observability Expansion
 * Distributed tracing primitives. Pure in-memory; export adapters can be wired later.
 */
import { recordMetric } from "./metrics";

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  region?: string;
  tenantId?: string;
  attributes?: Record<string, string | number | boolean>;
  status: "running" | "ok" | "error";
  error?: string;
}

const spans: TraceSpan[] = [];

function uuid() {
  return crypto.randomUUID();
}

export function startSpan(name: string, parent?: TraceSpan, attrs?: TraceSpan["attributes"]): TraceSpan {
  const span: TraceSpan = {
    traceId: parent?.traceId ?? uuid(),
    spanId: uuid(),
    parentSpanId: parent?.spanId,
    name,
    startedAt: Date.now(),
    attributes: attrs,
    status: "running",
  };
  spans.push(span);
  if (spans.length > 2000) spans.shift();
  return span;
}

export function endSpan(span: TraceSpan, status: "ok" | "error" = "ok", error?: string) {
  span.endedAt = Date.now();
  span.durationMs = span.endedAt - span.startedAt;
  span.status = status;
  span.error = error;
  recordMetric(`trace.${span.name}.duration_ms`, span.durationMs, "ms", {
    status,
    ...(span.tenantId ? { tenantId: span.tenantId } : {}),
  });
}

export async function withSpan<T>(name: string, fn: (span: TraceSpan) => Promise<T>, parent?: TraceSpan): Promise<T> {
  const span = startSpan(name, parent);
  try {
    const result = await fn(span);
    endSpan(span, "ok");
    return result;
  } catch (err) {
    endSpan(span, "error", (err as Error).message);
    throw err;
  }
}

export function getRecentSpans(limit = 100): TraceSpan[] {
  return spans.slice(-limit);
}

export function getTrace(traceId: string): TraceSpan[] {
  return spans.filter((s) => s.traceId === traceId);
}
