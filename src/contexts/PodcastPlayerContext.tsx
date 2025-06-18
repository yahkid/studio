
// src/contexts/PodcastPlayerContext.tsx
"use client";

import type { CurrentTrack } from '@/types/podcast';
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

interface PodcastPlayerContextType {
  isPlaying: boolean;
  currentTrack: CurrentTrack | null;
  playTrack: (track: CurrentTrack) => void;
  togglePlayPause: () => void;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
  isLoading: boolean;
}

const PodcastPlayerContext = createContext<PodcastPlayerContextType | undefined>(undefined);

export const PodcastPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      // Potentially play next track here if implementing a queue
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);


    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);


    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const playTrack = useCallback((track: CurrentTrack) => {
    if (audioRef.current) {
      if (currentTrack?.id === track.id && isPlaying) {
        // If same track is playing, do nothing or pause based on preference
        // For now, let togglePlayPause handle it.
        // audioRef.current.pause();
        // setIsPlaying(false);
        return;
      }
      if (currentTrack?.id !== track.id) {
        audioRef.current.src = track.audio_url;
        setCurrentTime(0); // Reset time for new track
      }
      setCurrentTrack(track);
      setIsLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(err => {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [currentTrack, isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play().then(() => {
        setIsLoading(false);
      }).catch(err => {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return (
    <PodcastPlayerContext.Provider value={{ 
      isPlaying, 
      currentTrack, 
      playTrack, 
      togglePlayPause,
      duration,
      currentTime,
      seek,
      isLoading
    }}>
      {children}
    </PodcastPlayerContext.Provider>
  );
};

export const usePodcastPlayer = (): PodcastPlayerContextType => {
  const context = useContext(PodcastPlayerContext);
  if (context === undefined) {
    throw new Error('usePodcastPlayer must be used within a PodcastPlayerProvider');
  }
  return context;
};
