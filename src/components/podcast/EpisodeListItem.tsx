
// src/components/podcast/EpisodeListItem.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { BuzzsproutEpisode } from '@/types/podcast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, CalendarDays, Clock } from 'lucide-react';
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
  const parsedDate = parseISO(episode.published_at);

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    // Strip HTML for the snippet
    const strippedText = text.replace(/<[^>]+>/g, '');
    if (strippedText.length <= maxLength) return strippedText;
    return strippedText.substring(0, strippedText.lastIndexOf(' ', maxLength)) + '...';
  };

  return (
    <Link 
      href={`/podcast/${episode.id}`} 
      className="block group rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={`View details for episode: ${episode.title}`}
    >
      <Card className="flex flex-col h-full overflow-hidden group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out">
        {episode.artwork_url && (
          <div className="aspect-video relative overflow-hidden">
              <Image
                src={episode.artwork_url}
                alt={`Artwork for ${episode.title}`}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint="podcast episode art"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="h-12 w-12 text-white/90" />
              </div>
          </div>
        )}
        <CardHeader className="pb-3">
          {episode.season_number && episode.episode_number && (
            <p className="text-xs text-primary font-semibold mb-1">
              Msimu {episode.season_number} &bull; Kipindi {episode.episode_number}
            </p>
          )}
          
          <CardTitle className="font-headline text-lg md:text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
            {episode.title}
          </CardTitle>
          
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
            {truncateDescription(episode.description)}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
