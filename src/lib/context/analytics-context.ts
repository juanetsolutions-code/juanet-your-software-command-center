/**
 * Analytics Context for AI insights.
 */

export function buildAnalyticsContext(data: any) {
  return {
    summary: "Analytics data prepared for AI analysis",
    metrics: data,
    generatedAt: new Date().toISOString(),
  };
}
