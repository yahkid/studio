
// src/app/podcast/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import type { BuzzsproutEpisode, CurrentTrack } from '@/types/podcast';
import { usePodcastPlayer } from '@/contexts/PodcastPlayerContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlayCircle, PauseCircle, Loader2, ExternalLink, CalendarDays, Clock, UserCircle, Tag, AlertCircle, ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


// Function to format duration from seconds to MM:SS or HH:MM:SS
function formatDuration(seconds: number): string {
  const H = Math.floor(seconds / 3600);
  const M = Math.floor((seconds % 3600) / 60);
  const S = Math.floor(seconds % 60);
  let str = "";
  if (H > 0) str += `${H}:`;
  str += `${M < 10 && H > 0 ? '0' : ''}${M}:`;
  str += `${S < 10 ? '0' : ''}${S}`;
  return str;
}


export default function PodcastEpisodePage() {
  const params = useParams();
  const episodeId = params.id as string;

  const [episode, setEpisode] = useState<BuzzsproutEpisode | null>(null);
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { playTrack, currentTrack, isPlaying, togglePlayPause, isLoading: isPlayerLoading } = usePodcastPlayer();
  
  const isCurrentPlayingEpisode = currentTrack?.id === episode?.id;

  useEffect(() => {
    if (episodeId) {
      const fetchEpisode = async () => {
        setIsLoadingEpisode(true);
        setError(null);
        try {
          const response = await fetch(`/api/podcast-episodes/${episodeId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch episode: ${response.statusText}`);
          }
          const data: BuzzsproutEpisode = await response.json();
          setEpisode(data);
        } catch (err: any) {
          setError(err.message || 'An unknown error occurred.');
          console.error(`Error fetching podcast episode ${episodeId}:`, err);
        } finally {
          setIsLoadingEpisode(false);
        }
      };
      fetchEpisode();
    }
  }, [episodeId]);

  const handlePlayClick = () => {
    if (!episode) return;
    if (isCurrentPlayingEpisode) {
        togglePlayPause();
    } else {
        const trackToPlay: CurrentTrack = {
          id: episode.id,
          title: episode.title,
          audio_url: episode.audio_url,
          artwork_url: episode.artwork_url,
        };
        playTrack(trackToPlay);
    }
  };

  if (isLoadingEpisode) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body">Inapakia kipindi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hitilafu Ilitokea</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
          <Button asChild variant="link" className="mt-4">
            <Link href="/podcast">Rudi Kwenye Orodha ya Vipindi</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="font-body text-muted-foreground">Kipindi hakikupatikana.</p>
         <Button asChild variant="link" className="mt-4">
            <Link href="/podcast">Rudi Kwenye Orodha ya Vipindi</Link>
          </Button>
      </div>
    );
  }
  
  // Sanitize HTML for show notes
  const cleanShowNotes = typeof window !== 'undefined' ? DOMPurify.sanitize(episode.description) : episode.description;


  return (
    <div className="container mx-auto py-8 px-4">
        <Button asChild variant="outline" className="mb-8 font-body">
          <Link href="/podcast">
            <ArrowLeft className="mr-2 h-4 w-4" /> Rudi Kwenye Vipindi Vyote
          </Link>
        </Button>

      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative aspect-square md:aspect-auto">
            {episode.artwork_url && (
              <Image
                src={episode.artwork_url}
                alt={`Jalada la ${episode.title}`}
                fill
                style={{objectFit: "cover"}}
                className="bg-muted"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                data-ai-hint="podcast episode art detail"
              />
            )}
          </div>
          <div className="md:w-2/3">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-2xl md:text-3xl lg:text-4xl text-foreground">
                {episode.title}
              </CardTitle>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                  <span>Tarehe: {format(parseISO(episode.published_at), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <span>Muda: {formatDuration(episode.duration)}</span>
                </div>
                {episode.artist && (
                  <div className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Msimamizi: {episode.artist}</span>
                  </div>
                )}
                {episode.season_number && episode.episode_number && (
                    <p className="text-xs text-primary/80 font-semibold">
                        Msimu {episode.season_number} &bull; Kipindi {episode.episode_number}
                    </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={handlePlayClick}
                className="w-full sm:w-auto font-headline mb-6"
                size="lg"
                disabled={isPlayerLoading && isCurrentPlayingEpisode}
                suppressHydrationWarning={true}
              >
                {isPlayerLoading && isCurrentPlayingEpisode ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isCurrentPlayingEpisode && isPlaying ? (
                  <PauseCircle className="mr-2 h-5 w-5" />
                ) : (
                  <PlayCircle className="mr-2 h-5 w-5" />
                )}
                {isPlayerLoading && isCurrentPlayingEpisode ? 'Inapakia...' : (isCurrentPlayingEpisode && isPlaying ? 'Sitisha' : 'Sikiliza Kipindi')}
              </Button>

              <h2 className="font-headline text-xl text-foreground mb-2">Maelezo ya Kipindi:</h2>
              <div
                className="prose prose-sm dark:prose-invert max-w-none font-body text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: cleanShowNotes }}
              />
              {episode.tags && episode.tags.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-headline text-md text-foreground mb-2">Vitambulisho:</h3>
                    <div className="flex flex-wrap gap-2">
                        {episode.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full border">{tag}</span>
                        ))}
                    </div>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Add getStaticPaths and getStaticProps if using SSG for these pages
// For dynamic fetching on client-side as implemented, this is not strictly needed
// but for SEO and performance, consider SSG/ISR.
// Example for ISR (Not fully implemented here, just a pointer):
// export async function getStaticPaths() { /* Fetch all episode IDs */ }
// export async function getStaticProps({ params }) { /* Fetch specific episode data */ }

// We also need to configure the dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // In a real app, fetch only necessary fields for metadata to be faster.
    // This might involve a separate, lighter API endpoint or direct DB query if applicable.
    // For now, using the existing API route.
    const podcastId = process.env.NEXT_PUBLIC_BUZZSPROUT_PODCAST_ID;
    const apiKey = process.env.BUZZSPROUT_API_KEY;

    if (!podcastId || !apiKey) {
      console.warn("Buzzsprout API credentials not configured for metadata generation.");
      return { title: "Kipindi cha Podikasti" };
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
      return { title: "Kipindi Hakikupatikana" };
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
        type: 'music.song', // or 'podcast.episode' if more appropriate
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
