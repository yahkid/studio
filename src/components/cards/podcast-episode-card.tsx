
// @/components/cards/podcast-episode-card.tsx
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { PodcastEpisode } from '@/lib/podcast-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, CalendarDays, Clock, ChevronUpCircle, ChevronDownCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface PodcastEpisodeCardProps {
  episode: PodcastEpisode;
  layout?: 'default' | 'compact';
}

export function PodcastEpisodeCard({ episode, layout = 'default' }: PodcastEpisodeCardProps) {
  const parsedDate = parseISO(episode.publishDate);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTogglePlayer = () => {
    const newShowPlayerState = !showPlayer;
    setShowPlayer(newShowPlayerState);
    if (newShowPlayerState && audioRef.current) {
      // Optional: Attempt to play. Browsers might block autoplay without user interaction.
      // audioRef.current.play().catch(error => console.log("Autoplay prevented:", error));
    } else if (!newShowPlayerState && audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {layout === 'default' && episode.coverImageUrl && (
        <div className="aspect-square w-full relative group overflow-hidden">
          <Image
            src={episode.coverImageUrl}
            alt={`Jalada la kipindi: ${episode.title}`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="podcast cover art"
          />
        </div>
      )}
      <CardHeader className={layout === 'compact' ? "pb-2 pt-4 px-4" : "pb-4"}>
        {episode.seasonNumber && episode.episodeNumber && (
           <Badge variant="secondary" className="mb-2 w-fit text-xs">
            Msimu {episode.seasonNumber} &bull; Kipindi {episode.episodeNumber}
          </Badge>
        )}
        <CardTitle className={`font-headline ${layout === 'compact' ? 'text-lg' : 'text-xl'} text-foreground leading-tight`}>
          {episode.title}
        </CardTitle>
        <div className={`flex items-center space-x-3 text-xs text-muted-foreground mt-1 ${layout === 'compact' ? 'mb-0' : 'mb-1'}`}>
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            <span>{format(parsedDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            <span>{episode.duration}</span>
          </div>
        </div>
      </CardHeader>
      {layout === 'default' && (
        <CardContent className="flex-grow">
          <p className="font-body text-sm text-muted-foreground line-clamp-3">
            {episode.description}
          </p>
        </CardContent>
      )}
      <CardFooter className={`flex flex-col items-stretch ${layout === 'compact' ? "pt-2 pb-4 px-4" : "pt-4"}`}>
        <Button
          onClick={handleTogglePlayer}
          className="w-full font-headline"
          variant="outline"
          size={layout === 'compact' ? 'sm' : 'default'}
          suppressHydrationWarning={true}
        >
          {showPlayer ? <ChevronUpCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
          {showPlayer ? 'Ficha Kicheza Sauti' : 'Sikiliza Hapa'}
        </Button>
        {showPlayer && (
          <div className="mt-4">
            <audio ref={audioRef} controls src={episode.audioUrl} className="w-full h-10">
              Tarjuma yako haikubali kicheza sauti.
            </audio>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
