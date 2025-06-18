
// src/types/podcast.ts
export interface BuzzsproutEpisode {
  id: number;
  title: string;
  description: string; // HTML content
  published_at: string; // ISO 8601 date string
  duration: number; // in seconds
  audio_url: string;
  artwork_url: string;
  episode_number: number | null;
  season_number: number | null;
  // Add other fields you might need from the Buzzsprout API
  guid: string;
  artist: string;
  tags: string[];
  explicit: boolean;
  private: boolean;
}

export interface CurrentTrack extends Pick<BuzzsproutEpisode, 'audio_url' | 'title' | 'artwork_url' | 'id'> {
  // any other properties specific to the player's current track state
}
