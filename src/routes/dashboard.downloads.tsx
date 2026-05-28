import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Package, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/downloads")({
  component: DownloadsPage,
  head: () => ({
    meta: [
      { title: "Downloads | Juanet" },
      { name: "description", content: "SDK, documentation, and tools for your projects." },
    ],
  }),
});

const downloads = [
  {
    id: "d-1",
    name: "Juanet SDK v2.4.1",
    type: "TypeScript",
    size: "2.4 MB",
    updated: "2 days ago",
  },
  {
    id: "d-2",
    name: "API Documentation",
    type: "PDF",
    size: "1.8 MB",
    updated: "1 week ago",
  },
  {
    id: "d-3",
    name: "Design Kit",
    type: "Figma",
    size: "45 MB",
    updated: "2 weeks ago",
  },
  {
    id: "d-4",
    name: "Mobile Client",
    type: "React Native",
    size: "15 MB",
    updated: "3 weeks ago",
  },
];

function DownloadsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Downloads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            SDK, documentation, and tools for your projects.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total downloads" value="1,242" delta="This month" icon={Download} />
        <StatCard
          label="SDK versions"
          value="3"
          delta="Latest v2.4.1"
          icon={Package}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Documentation"
          value="5"
          delta="Always updated"
          icon={FileText}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="File size total"
          value="64 MB"
          delta="All assets"
          icon={Package}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Available downloads</h2>
          <Link
            to="/dashboard/downloads"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Type</th>
                <th className="py-2 font-medium">Size</th>
                <th className="py-2 font-medium">Updated</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {downloads.map((d) => (
                <tr key={d.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 font-medium">{d.name}</td>
                  <td className="py-3 text-muted-foreground">{d.type}</td>
                  <td className="py-3 text-muted-foreground">{d.size}</td>
                  <td className="py-3 text-muted-foreground">{d.updated}</td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-brand-cyan hover:underline">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}