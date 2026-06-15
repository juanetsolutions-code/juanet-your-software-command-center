import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listDownloads } from "@/lib/client-dashboard";

export const Route = createFileRoute("/dashboard/downloads")({
  component: DownloadsPage,
});

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function DownloadsPage() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["downloads"],
    queryFn: listDownloads,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Downloads</h1>
          <p className="text-sm text-muted-foreground mt-1">Installers, SDKs and assets you have access to.</p>
        </div>
        <Download className="h-6 w-6 text-brand-cyan" />
      </header>

      {isLoading ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground">No downloads available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((d) => (
            <div key={d.id} className="glass rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {d.name} {d.version && <span className="text-muted-foreground text-xs">v{d.version}</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {d.kind} · {formatSize(d.sizeBytes)} · {new Date(d.createdAt).toLocaleDateString()}
                </div>
                {d.description && (
                  <div className="text-xs text-muted-foreground mt-1">{d.description}</div>
                )}
              </div>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs rounded-lg bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
