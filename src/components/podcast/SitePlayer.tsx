
// src/components/podcast/SitePlayer.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { usePodcastPlayer } from '@/contexts/PodcastPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Loader2, XCircle, Volume2, VolumeX } from 'lucide-react'; // Added Volume icons
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
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
    playTrack // To allow closing
  } = usePodcastPlayer();

  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1); // Volume from 0 to 1

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleClosePlayer = () => {
    // Effectively "close" by setting currentTrack to null
    // Need to update context to support this. For now, just stop.
    if (currentTrack) {
      // A proper "stop" or "clearTrack" function in context would be better
      // For now, this simulates stopping and hiding.
      const audioEl = document.querySelector('audio'); // hacky, context should manage audioEl
      if(audioEl) audioEl.pause();
      // To truly hide, PodcastPlayerContext needs a clearTrack function
      // playTrack(null as any); // This would error if null not allowed.
      // For now, a more robust solution for clearing the track is needed in the context
      console.warn("SitePlayer: Close functionality needs context update for clearTrack.")
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    const audioEl = document.querySelector('audio'); // Accessing audio element directly
    if (audioEl) {
        audioEl.volume = newVolume;
        setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const audioEl = document.querySelector('audio');
    if (audioEl) {
        if (isMuted) {
            audioEl.muted = false;
            setIsMuted(false);
            // If volume was 0 due to mute, restore to previous or default
            if (volume === 0) setVolume(0.5); 
            audioEl.volume = volume === 0 ? 0.5 : volume;
        } else {
            audioEl.muted = true;
            setIsMuted(true);
        }
    }
  };


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
          <p className="text-sm font-semibold truncate" title={currentTrack.title}>
            {currentTrack.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100} // Use 100 as default if duration is 0 to prevent errors
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
          aria-label={isPlaying ? "Pause episode" : "Play episode"}
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
        
        {/* Volume Controls */}
        <div className="hidden md:flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute} 
                className="rounded-full w-8 h-8"
                aria-label={isMuted ? "Unmute" : "Mute"}
                suppressHydrationWarning={true}
            >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20 h-2 [&>span:first-child]:h-2 [&>span>span]:h-2"
                aria-label="Volume control"
            />
        </div>

        {/* Close button */}
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClosePlayer} 
            className="rounded-full w-8 h-8 md:w-10 md:h-10"
            aria-label="Close podcast player"
            suppressHydrationWarning={true}
        >
            <XCircle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>
    </div>
  );
}
