import { useState, useEffect, useRef } from "react";
import { Search, Command, ArrowUpRight } from "lucide-react";
import { search, type SearchResult } from "@/lib/search/global-search";
import { Link } from "@tanstack/react-router";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = search({ query });
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const openEvent = new CustomEvent("openCommandPalette");
        window.dispatchEvent(openEvent);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-2xl mx-4 shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, invoices, messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg placeholder:text-muted-foreground outline-none"
          />
          <div className="text-xs text-muted-foreground px-2 py-1 rounded bg-white/5">
            ESC
          </div>
        </div>

        {results.length > 0 && (
          <ul className="max-h-96 overflow-y-auto p-2">
            {results.map((result) => (
              <li key={result.id}>
                <Link
                  to={result.url as any}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{result.title}</div>
                    {result.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {result.description}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  return {
    isOpen: open,
    open: () => setOpen(true),
    close: () => setOpen(false),
  };
}