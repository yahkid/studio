
// src/components/podcast/EpisodeListItem.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { BuzzsproutEpisode, CurrentTrack } from '@/types/podcast';
import { usePodcastPlayer } from '@/contexts/PodcastPlayerContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, PauseCircle, CalendarDays, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EpisodeListItemProps {
  episode: BuzzsproutEpisode;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export function EpisodeListItem({ episode }: EpisodeListItemProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause, isLoading } = usePodcastPlayer();
  const parsedDate = parseISO(episode.published_at);
  const isCurrentEpisode = currentTrack?.id === episode.id;

  const handlePlayClick = () => {
    if (isCurrentEpisode) {
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
  
  // Truncate description for list view
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, text.lastIndexOf(' ', maxLength)) + '...';
  };


  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {episode.artwork_url && (
        <Link href={`/podcast/${episode.id}`} className="block group aspect-video relative overflow-hidden">
            <Image
              src={episode.artwork_url}
              alt={`Artwork for ${episode.title}`}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="podcast episode art"
            />
        </Link>
      )}
      <CardHeader className="pb-3">
        {episode.season_number && episode.episode_number && (
          <p className="text-xs text-primary font-semibold mb-1">
            Msimu {episode.season_number} &bull; Kipindi {episode.episode_number}
          </p>
        )}
        <Link href={`/podcast/${episode.id}`}>
          <CardTitle className="font-headline text-lg md:text-xl text-foreground leading-tight hover:text-primary transition-colors">
            {episode.title}
          </CardTitle>
        </Link>
        <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1.5">
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            <span>{format(parsedDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            <span>{formatDuration(episode.duration)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <CardDescription className="font-body text-sm text-muted-foreground line-clamp-3">
          {truncateDescription(episode.description.replace(/<[^>]+>/g, ''), 120)} {/* Strip HTML for snippet */}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-stretch gap-2 pt-3">
        <Button
          onClick={handlePlayClick}
          className="w-full font-headline flex-1"
          variant={isCurrentEpisode && isPlaying ? "secondary" : "default"}
          disabled={isLoading && isCurrentEpisode}
          suppressHydrationWarning={true}
        >
          {isLoading && isCurrentEpisode ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isCurrentEpisode && isPlaying ? (
            <PauseCircle className="mr-2 h-4 w-4" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          {isLoading && isCurrentEpisode ? "Inapakia..." : (isCurrentEpisode && isPlaying ? 'Sitisha' : 'Sikiliza')}
        </Button>
        <Button asChild variant="outline" className="w-full font-headline flex-1" suppressHydrationWarning={true}>
          <Link href={`/podcast/${episode.id}`}>
            Maelezo Zaidi <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
