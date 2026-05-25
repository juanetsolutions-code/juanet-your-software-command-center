/**
 * Executive Intelligence Infrastructure - Business Insights
 * Aggregates high-level business signals for executive consumption (no UI).
 */

export interface BusinessInsight {
  tenantId: string;
  category: "revenue" | "growth" | "retention" | "efficiency";
  insight: string;
  value: number | string;
  trend: "up" | "down" | "flat";
  confidence: number;
  generatedAt: string;
}

export class BusinessInsights {
  generate(tenantId: string, data: Record<string, any>): BusinessInsight[] {
    const insights: BusinessInsight[] = [];
    if (data.arr) {
      insights.push({
        tenantId,
        category: "revenue",
        insight: "ARR trajectory positive",
        value: data.arr,
        trend: "up",
        confidence: 0.88,
        generatedAt: new Date().toISOString(),
      });
    }
    return insights;
  }
}

export const businessInsights = new BusinessInsights();
