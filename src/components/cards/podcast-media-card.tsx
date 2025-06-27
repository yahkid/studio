"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePodcastPlayer } from '@/contexts/PodcastPlayerContext';
import type { BuzzsproutEpisode } from '@/types/podcast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Loader2, PauseCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PodcastMediaCardProps {
  episode: BuzzsproutEpisode;
}

export function PodcastMediaCard({ episode }: PodcastMediaCardProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause, isLoading: isPlayerLoading } = usePodcastPlayer();
  const isCurrentPlayingEpisode = currentTrack?.id === episode.id;

  const handlePlay = () => {
    if (isCurrentPlayingEpisode) {
      togglePlayPause();
    } else {
      playTrack({
        id: episode.id,
        title: episode.title,
        audio_url: episode.audio_url,
        artwork_url: episode.artwork_url,
      });
    }
  };
  
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (!text) return '';
    const strippedText = text.replace(/<[^>]+>/g, '');
    if (strippedText.length <= maxLength) return strippedText;
    return strippedText.substring(0, strippedText.lastIndexOf(' ', maxLength)) + '...';
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <Link href={`/podcast/${episode.id}`}>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg group">
            <Image
              src={episode.artwork_url}
              alt={`Artwork for ${episode.title}`}
              fill
              style={{ objectFit: 'cover' }}
              className="bg-muted group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="podcast episode art"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Podikasti ya Hivi Punde</p>
        <CardTitle className="font-headline text-xl mt-2 line-clamp-2">
          <Link href={`/podcast/${episode.id}`} className="hover:text-primary transition-colors">
            {episode.title}
          </Link>
        </CardTitle>
        <CardDescription className="mt-2 text-sm font-body line-clamp-3">
          {truncateDescription(episode.description)}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePlay} className="w-full font-headline" disabled={isPlayerLoading && !isCurrentPlayingEpisode} suppressHydrationWarning>
            {isPlayerLoading && isCurrentPlayingEpisode ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isPlaying && isCurrentPlayingEpisode ? (
              <PauseCircle className="mr-2 h-4 w-4" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
          {isPlayerLoading && isCurrentPlayingEpisode ? 'Inapakia...' : isPlaying && isCurrentPlayingEpisode ? 'Sitisha' : 'Sikiliza Sasa'}
        </Button>
      </CardFooter>
    </Card>
  );
}
