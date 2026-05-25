/**
 * Episodic Memory
 * Records specific episodes (sequences of events/decisions) for replay, learning, and explanation.
 */

export interface Episode {
  id: string;
  tenantId: string;
  sequence: Array<{ timestamp: string; event: string; data: any }>;
  outcome: string;
  tags: string[];
  importance: number;
}

export class EpisodicMemory {
  private episodes: Episode[] = [];

  recordEpisode(episode: Omit<Episode, "id">): Episode {
    const full: Episode = { ...episode, id: `epi-${Date.now()}` };
    this.episodes.push(full);
    return full;
  }

  replaySimilar(tenantId: string, tag: string, limit = 3): Episode[] {
    return this.episodes
      .filter((e) => e.tenantId === tenantId && e.tags.includes(tag))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }
}

export const episodicMemory = new EpisodicMemory();
