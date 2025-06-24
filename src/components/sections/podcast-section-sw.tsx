"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { EpisodeListItem } from '@/components/podcast/EpisodeListItem';
import { Button } from '@/components/ui/button';
import { MicVocal, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import type { BuzzsproutEpisode } from '@/types/podcast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';

export function PodcastSectionSw() {
  const [episodes, setEpisodes] = useState<BuzzsproutEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/podcast-episodes?limit=3');
        if (!response.ok) {
          throw new Error(`Failed to fetch episodes: ${response.statusText}`);
        }
        const data: BuzzsproutEpisode[] = await response.json();
        setEpisodes(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error("Error fetching podcast episodes for homepage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <motion.section
      id="podcast"
      className="w-full text-center py-16 md:py-24 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <MicVocal className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
          Sikiliza Podikasti Yetu
        </h2>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Pata mafundisho yenye nguvu, mahojiano ya kuvutia, na jumbe za kukutia moyo katika imani yako, popote ulipo.
        </p>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="max-w-xl mx-auto text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hitilafu Ilitokea</AlertTitle>
            <AlertDescription>
              Imeshindwa kupakia vipindi vya podikasti. Tafadhali jaribu tena baadaye.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && episodes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {episodes.map((episode) => (
              <EpisodeListItem key={episode.id} episode={episode} />
            ))}
          </div>
        )}

        <Button asChild size="lg" className="font-headline text-lg" suppressHydrationWarning={true}>
          <Link href="/podcast">
            Tazama Vipindi Vyote <ExternalLink className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
