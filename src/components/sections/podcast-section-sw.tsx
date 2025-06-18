
// @/components/sections/podcast-section-sw.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PodcastEpisodeCard } from '@/components/cards/podcast-episode-card';
import { getLatestPodcastEpisodes, type PodcastEpisode } from '@/lib/podcast-data';
import { MicVocal, ChevronRight } from 'lucide-react';

export function PodcastSectionSw() {
  const latestEpisodes = getLatestPodcastEpisodes(3); // Get latest 3 episodes

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

          {latestEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {latestEpisodes.map((episode) => (
                <PodcastEpisodeCard key={episode.id} episode={episode} layout="default" />
              ))}
            </div>
          ) : (
            <p className="font-body text-center text-muted-foreground py-8">
              Hakuna vipindi vipya vya podikasti kwa sasa. Angalia tena hivi karibuni!
            </p>
          )}

          <div className="text-center">
            <Button asChild size="lg" className="font-headline text-lg" suppressHydrationWarning={true}>
              <Link href="/podcast">
                Vipindi Vyote vya Podikasti <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
