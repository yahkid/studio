
// No "use client" here

import type { Metadata } from 'next';
import type { BuzzsproutEpisode } from '@/types/podcast';
import { PodcastEpisodeClientContent } from '@/components/podcast/PodcastEpisodeClientContent';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const podcastId = process.env.NEXT_PUBLIC_BUZZSPROUT_PODCAST_ID;
    const apiKey = process.env.BUZZSPROUT_API_KEY;

    if (!podcastId || !apiKey) {
      console.warn("Buzzsprout API credentials not configured for metadata generation.");
      return { 
        title: "Kipindi cha Podikasti | HSCM Connect",
        description: "Sikiliza kipindi hiki cha podikasti kutoka HSCM Connect." 
      };
    }
    
    const response = await fetch(
      `https://www.buzzsprout.com/api/${podcastId}/episodes/${params.id}.json`,
      {
        headers: {
          Authorization: `Token token=${apiKey}`,
        },
         next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
       console.error(`Failed to fetch episode metadata for ${params.id}: ${response.statusText}`);
      return { 
        title: "Kipindi Hakikupatikana | HSCM Connect",
        description: "Kipindi cha podikasti unachotafuta hakikupatikana."
      };
    }
    const episode: BuzzsproutEpisode = await response.json();
    
    const strippedDescription = episode.description.replace(/<[^>]+>/g, '').substring(0, 160);


    return {
      title: `${episode.title} | Podikasti ya HSCM Connect`,
      description: strippedDescription,
      openGraph: {
        title: episode.title,
        description: strippedDescription,
        images: episode.artwork_url ? [{ url: episode.artwork_url }] : [],
        type: 'music.song', 
        audio: episode.audio_url,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for podcast episode:", error);
    return {
      title: 'Kipindi cha Podikasti | HSCM Connect',
      description: 'Sikiliza kipindi hiki cha podikasti kutoka HSCM Connect.',
    };
  }
}

// This is the Page component (Server Component)
export default function PodcastEpisodePageServerWrapper({ params }: { params: { id: string } }) {
  const episodeId = params.id;
  return <PodcastEpisodeClientContent episodeId={episodeId} />;
}
