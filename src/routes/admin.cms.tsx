import { createFileRoute } from "@tanstack/react-router";
import { FileText, RefreshCw, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/cms")({
  component: AdminCMSPage,
  head: () => ({
    meta: [
      { title: "CMS | Admin Console" },
      { name: "description", content: "Manage static pages and marketing content." },
    ],
  }),
});

const pages = [
  {
    id: "page-001",
    title: "About Juanet",
    slug: "/about",
    status: "published",
    updated: "May 10, 2026",
  },
  {
    id: "page-002",
    title: "Pricing",
    slug: "/pricing",
    status: "published",
    updated: "May 5, 2026",
  },
  {
    id: "page-003",
    title: "Enterprise",
    slug: "/enterprise",
    status: "draft",
    updated: "Apr 28, 2026",
  },
];

function AdminCMSPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage static pages and marketing content.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pages" value="12" delta="All pages" icon={FileText} />
        <StatCard
          label="Published"
          value="9"
          delta="Live content"
          icon={FileText}
          accent="from-brand-blue to-brand-violet"
        />
        <StatCard
          label="Drafts"
          value="3"
          delta="Work in progress"
          icon={FileText}
          accent="from-brand-violet to-brand-cyan"
        />
        <StatCard
          label="SEO score"
          value="92%"
          delta="Optimized"
          icon={FileText}
          accent="from-brand-cyan to-brand-violet"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Pages</h2>
          <Link
            to="/admin/cms"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {pages.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No pages yet"
            description="Create pages to start managing content."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-2 font-medium">Title</th>
                  <th className="py-2 font-medium">Slug</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-medium">{p.title}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{p.slug}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                          p.status === "published"
                            ? "bg-brand-cyan/15 text-brand-cyan"
                            : "bg-white/10 text-muted-foreground"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}