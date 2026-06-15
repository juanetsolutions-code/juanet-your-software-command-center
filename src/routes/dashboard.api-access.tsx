import { createFileRoute } from "@tanstack/react-router";
import { Code2, Copy, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listApiTokens,
  createApiToken,
  revokeApiToken,
} from "@/lib/client-dashboard";

export const Route = createFileRoute("/dashboard/api-access")({
  component: ApiAccessPage,
});

function ApiAccessPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [showSecret, setShowSecret] = useState<string | null>(null);

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ["api-tokens"],
    queryFn: listApiTokens,
  });

  const create = useMutation({
    mutationFn: (n: string) => createApiToken(n),
    onSuccess: (res) => {
      if (res?.token) {
        setShowSecret(res.token);
        toast.success("Token created — copy now, you won't see it again");
      }
      setName("");
      qc.invalidateQueries({ queryKey: ["api-tokens"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: revokeApiToken,
    onSuccess: () => {
      toast.success("Token revoked");
      qc.invalidateQueries({ queryKey: ["api-tokens"] });
    },
  });

  function copy(value: string) {
    navigator.clipboard.writeText(value);
    toast.success("Copied");
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">API Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage personal access tokens for the Juanet API.
          </p>
        </div>
        <Code2 className="h-6 w-6 text-brand-cyan" />
      </header>

      <div className="glass rounded-2xl p-5">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Token name (e.g. Production)"
            className="flex-1 h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60"
          />
          <button
            onClick={() => name.trim() && create.mutate(name.trim())}
            disabled={!name.trim() || create.isPending}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Create token
          </button>
        </div>

        {showSecret && (
          <div className="mt-4 p-3 rounded-lg border border-brand-cyan/30 bg-brand-cyan/5">
            <div className="text-xs font-medium text-brand-cyan mb-1">
              New token (copy now, hidden after this)
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono break-all">{showSecret}</code>
              <button onClick={() => copy(showSecret)} className="p-1.5 rounded hover:bg-white/5">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setShowSecret(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5 space-y-3">
        {isLoading ? (
          <div className="text-center text-sm text-muted-foreground py-6">Loading…</div>
        ) : tokens.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-6">No tokens yet.</div>
        ) : (
          tokens.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <div className="font-medium">
                  {t.name}
                  {t.revokedAt && (
                    <span className="ml-2 text-[10px] text-red-400">revoked</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">
                  {t.tokenPrefix}••••••{t.lastFour}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Created {new Date(t.createdAt).toLocaleDateString()}
                  {t.lastUsedAt && ` · Last used ${new Date(t.lastUsedAt).toLocaleDateString()}`}
                </div>
              </div>
              {!t.revokedAt && (
                <button
                  onClick={() => revoke.mutate(t.id)}
                  className="p-2 rounded-lg hover:bg-white/5 text-red-400"
                  aria-label="Revoke token"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
