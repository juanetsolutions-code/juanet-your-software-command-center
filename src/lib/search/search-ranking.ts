import type { IndexDocument } from "./indexing-engine";

export function rankResults(q: string, docs: IndexDocument[]) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return docs.map((doc) => ({ doc, score: 0 }));
  return docs
    .map((doc) => {
      const haystack = `${doc.title} ${doc.body}`.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (haystack.includes(t)) score += 1;
        if (doc.title.toLowerCase().includes(t)) score += 2;
      }
      return { doc, score };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}
