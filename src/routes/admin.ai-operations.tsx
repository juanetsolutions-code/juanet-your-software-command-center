import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Activity, Brain, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/ai-operations")({
  component: AdminAIOpsPage,
});

const aiModels = [
  {
    id: "m-1",
    name: "GPT-4o",
    provider: "OpenAI",
    status: "operational",
    latency: "89ms",
    requests: "24.1K",
  },
  {
    id: "m-2",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    status: "operational",
    latency: "127ms",
    requests: "18.4K",
  },
  {
    id: "m-3",
    name: "O1-preview",
    provider: "OpenAI",
    status: "degraded",
    latency: "245ms",
    requests: "3.2K",
  },
  {
    id: "m-4",
    name: "Gemini 2.0",
    provider: "Google",
    status: "operational",
    latency: "78ms",
    requests: "12.8K",
  },
];

const agentTasks = [
  { id: "at-1", agent: "Task Assistant", status: "running", progress: "7/12 tasks" },
  { id: "at-2", agent: "Ops Assistant", status: "idle", progress: "0/0 tasks" },
  { id: "at-3", agent: "Finance Assistant", status: "running", progress: "2/5 tasks" },
];

function AdminAIOpsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">AI Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Model status, usage, and agent activity.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Models operational" value="3/4" delta="One degraded" icon={Cpu} />
        <StatCard
          label="Requests today"
          value="58.5K"
          delta="+12% vs yesterday"
          icon={Activity}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Avg. latency"
          value="132ms"
          delta="Across all models"
          icon={Cpu}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="Tokens used"
          value="2.1M"
          delta="72% of budget"
          icon={Brain}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Model status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Model</th>
                  <th className="py-2 font-medium">Provider</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Latency</th>
                  <th className="py-2 font-medium">Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {aiModels.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{m.name}</td>
                    <td className="py-3 text-muted-foreground">{m.provider}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {m.status === "operational" ? (
                          <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span
                          className={`text-[10px] uppercase tracking-wider ${
                            m.status === "operational" ? "text-brand-cyan" : "text-destructive"
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{m.latency}</td>
                    <td className="py-3 text-muted-foreground">{m.requests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Agent tasks</h2>
          <ul className="space-y-3">
            {agentTasks.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{a.agent}</div>
                  <div className="text-[11px] text-muted-foreground">{a.progress}</div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                    a.status === "running"
                      ? "bg-brand-cyan/15 text-brand-cyan"
                      : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
