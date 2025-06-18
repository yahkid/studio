
// @/app/podcast/page.tsx
import type { Metadata } from 'next';
import { podcastEpisodes, type PodcastEpisode } from '@/lib/podcast-data';
import { PodcastEpisodeCard } from '@/components/cards/podcast-episode-card';
import { MicVocal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Podikasti ya HSCM Connect | Mafundisho na Mahojiano',
  description: 'Sikiliza vipindi vya podikasti kutoka Holy Spirit Connect Ministry. Pata mafundisho, mahojiano, na jumbe za kukutia moyo.',
};

export default function PodcastPage() {
  const episodes = podcastEpisodes.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

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
      </header>

      {episodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {episodes.map((episode) => (
            <PodcastEpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-body text-muted-foreground text-lg">
            Hakuna vipindi vya podikasti vilivyopatikana kwa sasa. Tafadhali angalia tena hivi karibuni!
          </p>
        </div>
      )}
    </div>
  );
}
