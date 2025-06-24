
// src/components/podcast/SitePlayer.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { usePodcastPlayer } from '@/contexts/PodcastPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Loader2, X, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export function SitePlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    duration,
    currentTime,
    seek,
    isLoading,
    clearTrack,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = usePodcastPlayer();


  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;


  if (!currentTrack) {
    return null;
  }

  return (
    <div 
        className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-card text-card-foreground border-t border-border shadow-lg transition-transform duration-300 ease-in-out",
            currentTrack ? "translate-y-0" : "translate-y-full"
        )}
        aria-live="polite"
    >
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {currentTrack.artwork_url && (
          <Image
            src={currentTrack.artwork_url}
            alt={`Artwork for ${currentTrack.title}`}
            width={56}
            height={56}
            className="rounded-md object-cover h-14 w-14"
            data-ai-hint="podcast episode art"
          />
        )}
        <div className="flex-grow min-w-0">
          <Link href={`/podcast/${currentTrack.id}`} className="hover:underline">
            <p className="text-sm font-semibold truncate" title={currentTrack.title}>
              {currentTrack.title}
            </p>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-grow h-2 [&>span:first-child]:h-2 [&>span>span]:h-2"
              disabled={isLoading || !duration}
              aria-label="Seek podcast episode"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          disabled={isLoading}
          className="rounded-full w-10 h-10"
          aria-label={isPlaying ? "Sitisha" : "Sikiliza"}
          suppressHydrationWarning={true}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <div className="hidden md:flex items-center gap-2 group/volume">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute} 
                className="rounded-full w-8 h-8"
                aria-label={isMuted ? "Ondoa unyamazishaji" : "Nyamazisha"}
                suppressHydrationWarning={true}
            >
                <VolumeIcon className="h-4 w-4" />
            </Button>
            <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-[width] duration-300 h-2 [&>span:first-child]:h-2 [&>span>span]:h-2"
                aria-label="Kiwango cha sauti"
            />
        </div>

         <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearTrack} 
            className="rounded-full w-8 h-8 md:w-10 md:h-10"
            aria-label="Funga kichezaji cha podikasti"
            suppressHydrationWarning={true}
        >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>
    </div>
  );
}
