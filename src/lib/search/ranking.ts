/**
 * Ranking logic for search results.
 */

export function rankResults(results: any[], query: string) {
  // Simple placeholder ranking
  return results.sort((a, b) => b.score - a.score);
}
