"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EpisodeListItem } from '@/components/podcast/EpisodeListItem';
import type { BuzzsproutEpisode } from '@/types/podcast';
import { MicVocal, ChevronRight, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PodcastSectionSw() {
  const [latestEpisodes, setLatestEpisodes] = useState<BuzzsproutEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestEpisodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/podcast-episodes?limit=3'); // Fetch latest 3
        if (!response.ok) {
          throw new Error(`Failed to fetch latest episodes: ${response.statusText}`);
        }
        const data: BuzzsproutEpisode[] = await response.json();
        setLatestEpisodes(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred while fetching latest episodes.');
        console.error("Error fetching latest podcast episodes for homepage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestEpisodes();
  }, []);

  return (
    <section id="podcast" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <MicVocal className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6">
              SIKILIZA PODIKASTI YETU
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pata mafundisho yenye nguvu, mahojiano ya kuvutia, na jumbe za kukujenga katika imani yako kupitia podikasti yetu.
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 font-body text-muted-foreground">Inapakia vipindi vipya...</p>
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="max-w-md mx-auto my-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hitilafu ya Kupakia Vipindi</AlertTitle>
              <AlertDescription>
                Imeshindwa kupakia vipindi vya hivi karibuni. Tafadhali jaribu kuonyesha upya ukurasa.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && latestEpisodes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {latestEpisodes.map((episode) => (
                <EpisodeListItem key={episode.id} episode={episode} />
              ))}
            </div>
          )}

          {!isLoading && !error && latestEpisodes.length === 0 && (
            <p className="font-body text-center text-muted-foreground py-8">
              Hakuna vipindi vipya vya podikasti kwa sasa. Angalia tena hivi karibuni!
            </p>
          )}

          <div className="text-center space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:justify-center sm:items-center sm:gap-4">
            <Button asChild size="lg" className="font-headline text-lg w-full sm:w-auto" suppressHydrationWarning={true}>
              <Link href="/podcast">
                Vipindi Vyote vya Podikasti <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-headline text-lg w-full sm:w-auto" suppressHydrationWarning={true}>
              <Link href="https://innocentmorris.buzzsprout.com" target="_blank" rel="noopener noreferrer">
                Sikiliza Kwenye Buzzsprout <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
