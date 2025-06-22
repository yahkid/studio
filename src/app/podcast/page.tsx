
// src/app/podcast/page.tsx
"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { EpisodeListItem } from '@/components/podcast/EpisodeListItem';
import { Button } from '@/components/ui/button';
import { MicVocal, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import type { BuzzsproutEpisode } from '@/types/podcast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EPISODES_PER_PAGE = 6;

export default function PodcastPage() {
  const [allEpisodes, setAllEpisodes] = useState<BuzzsproutEpisode[]>([]);
  const [visibleEpisodes, setVisibleEpisodes] = useState<BuzzsproutEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/podcast-episodes');
        if (!response.ok) {
          throw new Error(`Failed to fetch episodes: ${response.statusText}`);
        }
        const data: BuzzsproutEpisode[] = await response.json();
        setAllEpisodes(data);
        setVisibleEpisodes(data.slice(0, EPISODES_PER_PAGE));
        setHasMore(data.length > EPISODES_PER_PAGE);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error("Error fetching podcast episodes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  const handleLoadMore = () => {
    const currentLength = visibleEpisodes.length;
    const nextEpisodes = allEpisodes.slice(currentLength, currentLength + EPISODES_PER_PAGE);
    setVisibleEpisodes([...visibleEpisodes, ...nextEpisodes]);
    setHasMore(allEpisodes.length > currentLength + EPISODES_PER_PAGE);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <MicVocal className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Podikasti ya HSCM Connect
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
          Karibu kwenye podikasti yetu ambapo tunashiriki mafundisho ya Neno la Mungu, mahojiano yenye kuvutia, na jumbe za kukujenga katika imani yako. Sikiliza wakati wowote, mahali popote.
        </p>
        <Button asChild size="lg" className="mt-6 font-headline" suppressHydrationWarning={true}>
          <Link href="https://innocentmorris.buzzsprout.com" target="_blank" rel="noopener noreferrer">
            Sikiliza Zaidi Kwenye Buzzsprout <ExternalLink className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </header>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-4 font-body text-muted-foreground">Inapakia vipindi...</p>
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hitilafu Ilitokea</AlertTitle>
          <AlertDescription>
            Imeshindwa kupakia vipindi vya podikasti. Tafadhali jaribu tena baadaye. ({error})
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && visibleEpisodes.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleEpisodes.map((episode) => (
              <EpisodeListItem key={episode.id} episode={episode} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-12">
              <Button onClick={handleLoadMore} size="lg" className="font-headline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Pakia Zaidi
              </Button>
            </div>
          )}
        </>
      )}

      {!isLoading && !error && allEpisodes.length === 0 && (
        <div className="text-center py-12">
          <p className="font-body text-muted-foreground text-lg">
            Hakuna vipindi vya podikasti vilivyopatikana kwa sasa. Tafadhali angalia tena hivi karibuni!
          </p>
        </div>
      )}
    </div>
  );
}
