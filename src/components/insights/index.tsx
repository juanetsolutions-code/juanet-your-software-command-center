import { Activity, CreditCard, BarChart3, TrendingUp, Users, Cpu, Brain, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { LoadingState } from "@/components/states/LoadingState";

export interface UsageTrendCardProps {
  data?: number[];
  loading?: boolean;
  label?: string;
  value?: string;
  change?: string;
}

export function UsageTrendCard({ data, loading, label = "Usage Trend", value = "2.4K", change = "+12%" }: UsageTrendCardProps) {
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Activity className="h-4 w-4 text-brand-cyan" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        <span className="text-xs text-brand-cyan">{change}</span>
      </div>
      <div className="mt-4 h-12 flex items-end gap-1">
        {data?.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-brand-cyan to-brand-blue"
            style={{ height: `${Math.max(10, (v / Math.max(...data)) * 100)}%` }}
          />
        )) ?? Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-brand-cyan to-brand-blue"
            style={{ height: `${20 + (i * 7) % 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export interface RevenueHealthCardProps {
  mrr?: string;
  change?: string;
  loading?: boolean;
}

export function RevenueHealthCard({ mrr = "$48,210", change = "+8.2%", loading }: RevenueHealthCardProps) {
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">MRR</span>
        <CreditCard className="h-4 w-4 text-brand-cyan" />
      </div>
      <div className="text-2xl font-semibold">{mrr}</div>
      <div className="mt-1 text-xs text-brand-cyan">{change} from last month</div>
    </div>
  );
}

export interface AIUsageCardProps {
  tokens?: string;
  requests?: string;
  loading?: boolean;
}

export function AIUsageCard({ tokens = "2.1M", requests = "58.5K", loading }: AIUsageCardProps) {
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">AI Usage</span>
        <Brain className="h-4 w-4 text-brand-cyan" />
      </div>
      <div className="text-2xl font-semibold">{tokens}</div>
      <div className="mt-1 text-xs text-muted-foreground">{requests} requests today</div>
    </div>
  );
}

export interface PlatformStatusCardProps {
  status?: "operational" | "degraded" | "outage";
  uptime?: string;
  latency?: string;
  loading?: boolean;
}

export function PlatformStatusCard({ status = "operational", uptime = "99.99%", latency = "68ms" }: PlatformStatusCardProps) {
  const statusColor = status === "operational" ? "text-brand-cyan" : status === "degraded" ? "text-yellow-400" : "text-destructive";

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">Platform Status</span>
        <Cpu className="h-4 w-4 text-brand-cyan" />
      </div>
      <div className={`text-sm font-medium capitalize ${statusColor}`}>{status}</div>
      <div className="mt-1 text-xs text-muted-foreground">
        Uptime: {uptime} &middot; Latency: {latency}
      </div>
    </div>
  );
}